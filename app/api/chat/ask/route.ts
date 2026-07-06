import { groq } from "@/lib/groq";
import { NextRequest, NextResponse } from "next/server";
import { PRFile } from "@/types/github";
import type { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";

export const POST = async (req: NextRequest) => {
  const { messages, selectedFiles } = (await req.json()) as {
    messages: ChatCompletionMessageParam[];
    selectedFiles: PRFile[];
  };

  const fileContext = selectedFiles
    .map(
      (f) => `### ${f.filename}\n\`\`\`diff\n${f.patch ?? "(binary)"}\n\`\`\``,
    )
    .join("\n\n");

  const stream = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    stream: true,
    messages: [
      {
        role: "system",
        content: `You are a senior code reviewer. Answer questions about the following PR diff.\n\n${fileContext}`,
      },
      ...messages,
    ],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content ?? "";
        if (delta) controller.enqueue(encoder.encode(delta));
      }
      controller.close();
    },
  });

  return new NextResponse(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
