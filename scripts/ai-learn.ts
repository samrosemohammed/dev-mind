import { streamText } from "ai";
import { groq } from "@ai-sdk/groq";

const { textStream } = await streamText({
  model: groq("openai/gpt-oss-120b"),
  prompt: "What is love?",
});
for await (const textPart of textStream) {
  process.stdout.write(textPart);
}
console.log("\nDone!");
