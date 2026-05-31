import { groq } from "@/lib/groq";
import { octokit } from "@/lib/github";
import { NextRequest, NextResponse } from "next/server";
import { PRFile } from "@/types/github";

// Tools the agent can call
const tools = [
  {
    type: "function" as const,
    function: {
      name: "get_file_content",
      description: "Fetch the full content of a file from the PR's base branch",
      parameters: {
        type: "object",
        properties: {
          owner: { type: "string" },
          repo: { type: "string" },
          path: { type: "string" },
          ref: { type: "string", description: "branch or commit SHA" },
        },
        required: ["owner", "repo", "path", "ref"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "list_pr_files",
      description:
        "List all files changed in the PR with their status and additions/deletions",
      parameters: {
        type: "object",
        properties: {
          owner: { type: "string" },
          repo: { type: "string" },
          pull_number: { type: "number" },
        },
        required: ["owner", "repo", "pull_number"],
      },
    },
  },
];

async function executeTool(name: string, args: Record<string, unknown>) {
  if (name === "get_file_content") {
    const { owner, repo, path, ref } = args as Record<string, string>;
    const { data } = await octokit.request(
      "GET /repos/{owner}/{repo}/contents/{path}",
      {
        owner,
        repo,
        path,
        ref,
        headers: { "X-GitHub-Api-Version": "2022-11-28" },
      },
    );
    const content =
      "content" in data
        ? Buffer.from(data.content as string, "base64").toString("utf-8")
        : "(binary)";
    return { path, content };
  }

  if (name === "list_pr_files") {
    const { owner, repo, pull_number } = args as {
      owner: string;
      repo: string;
      pull_number: number;
    };
    const { data } = await octokit.request(
      "GET /repos/{owner}/{repo}/pulls/{pull_number}/files",
      {
        owner,
        repo,
        pull_number,
        headers: { "X-GitHub-Api-Version": "2022-11-28" },
      },
    );
    return data.map((f) => ({
      filename: f.filename,
      status: f.status,
      additions: f.additions,
      deletions: f.deletions,
    }));
  }

  throw new Error(`Unknown tool: ${name}`);
}

export const POST = async (req: NextRequest) => {
  const { messages, selectedFiles, prMeta } = (await req.json()) as {
    messages: { role: string; content: string }[];
    selectedFiles: PRFile[];
    prMeta: { owner: string; repo: string; pull_number: number };
  };

  const fileContext = selectedFiles
    .map(
      (f) => `### ${f.filename}\n\`\`\`diff\n${f.patch ?? "(binary)"}\n\`\`\``,
    )
    .join("\n\n");

  const systemPrompt = `You are an expert code review agent with access to GitHub tools.
You are reviewing PR #${prMeta.pull_number} in ${prMeta.owner}/${prMeta.repo}.
Use tools to fetch additional context when needed before giving a thorough review.

Currently selected file diffs:
${fileContext}`;

  // Agentic loop — max 6 iterations to prevent runaway calls
  const agentMessages: Parameters<
    typeof groq.chat.completions.create
  >[0]["messages"] = [
    { role: "system", content: systemPrompt },
    ...(messages as { role: "user" | "assistant"; content: string }[]),
  ];

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      const send = (text: string) => controller.enqueue(encoder.encode(text));

      for (let i = 0; i < 6; i++) {
        const response = await groq.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          messages: agentMessages,
          tools,
          tool_choice: "auto",
          stream: false, // collect full response to check for tool calls
        });

        const msg = response.choices[0].message;
        agentMessages.push(msg);

        // No tool calls → stream final answer and break
        if (!msg.tool_calls?.length) {
          // Stream the final text token by token for UI responsiveness
          const words = (msg.content ?? "").split(" ");
          for (const word of words) {
            send(word + " ");
            await new Promise((r) => setTimeout(r, 8));
          }
          break;
        }

        // Execute all tool calls in parallel
        const toolResults = await Promise.all(
          msg.tool_calls.map(async (tc) => {
            const args = JSON.parse(tc.function.arguments);
            const result = await executeTool(tc.function.name, args);
            return { tool_call_id: tc.id, name: tc.function.name, result };
          }),
        );

        // Push tool results back into message history
        for (const tr of toolResults) {
          agentMessages.push({
            role: "tool",
            tool_call_id: tr.tool_call_id,
            content: JSON.stringify(tr.result),
          });
          // Signal to UI which tool ran (parsed on client)
          send(`\n__TOOL__:${tr.name}\n`);
        }
      }

      controller.close();
    },
  });

  return new NextResponse(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
