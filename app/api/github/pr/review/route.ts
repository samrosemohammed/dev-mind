import { groq } from "@/lib/groq";
import { PRFile } from "@/types/github";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { files }: { files: PRFile[] } = await req.json();

  const MAX_PATCH_LINES = 50;
  const MAX_FILES = 10;
  const MAX_CHARS = 8000;

  const truncatePatch = (patch: string) => {
    const lines = patch.split("\n");
    return lines.length <= MAX_PATCH_LINES
      ? patch
      : lines.slice(0, MAX_PATCH_LINES).join("\n") + "\n... (truncated)";
  };

  let diffContext = files
    .filter((file) => file.patch)
    .slice(0, MAX_FILES)
    .map(
      (file) => `
File: ${file.filename}
Status: ${file.status}
Changes: +${file.additions} -${file.deletions}

${truncatePatch(file.patch!)}
  `,
    )
    .join("\n---\n");

  if (diffContext.length > MAX_CHARS) {
    diffContext = diffContext.slice(0, MAX_CHARS) + "\n\n... (truncated)";
  }

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 1000,
    messages: [
      {
        role: "system",
        content: `You are a senior software engineer reviewing a pull request. 
For each issue found, specify the file name, what the problem is, why it matters, and a concrete suggestion.
Be concise. Focus on real bugs and important issues, not style nitpicks.`,
      },
      {
        role: "user",
        content: `Please review this pull request:\n\n${diffContext}`,
      },
    ],
  });

  const review = response.choices[0].message.content;

  return NextResponse.json({ review });
};
