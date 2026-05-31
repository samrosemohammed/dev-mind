import { ChatMessage } from "@/types/chat";
import { cn } from "@/lib/utils";
import { Bot, Wrench, Check } from "lucide-react";
import { MarkdownContent } from "./markdown-content";

interface Props {
  message: ChatMessage;
  isStreaming?: boolean;
}

const TOOL_REGEX = /__TOOL__:(\w+)\n/g;

function parseContent(raw: string) {
  const toolCalls: string[] = [];
  const text = raw.replace(TOOL_REGEX, (_, name) => {
    toolCalls.push(name);
    return "";
  });
  return { text: text.trim(), toolCalls };
}

const TOOL_LABELS: Record<string, string> = {
  get_file_content: "Fetching file",
  list_pr_files: "Listing PR files",
};

export const MessageBubble = ({ message, isStreaming }: Props) => {
  const isUser = message.role === "user";
  const { text, toolCalls } = parseContent(message.content);

  return (
    <div
      className={cn(
        "flex flex-col gap-1.5",
        isUser ? "items-end" : "items-start",
      )}
    >
      {!isUser &&
        toolCalls.map((tool, i) => (
          <ToolPill key={i} name={tool} done={!isStreaming} />
        ))}

      <div
        className={cn(
          "max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
          isUser
            ? "rounded-br-sm bg-primary text-primary-foreground"
            : "rounded-bl-sm border bg-muted/50 text-foreground",
        )}
      >
        {isUser ? (
          // User messages are plain text — no markdown needed
          <p className="whitespace-pre-wrap break-words">{text}</p>
        ) : (
          // Assistant messages render markdown
          <div className="relative">
            <MarkdownContent content={text} />
            {isStreaming && (
              <span className="ml-0.5 inline-block h-3.5 w-0.5 animate-[blink_1s_step-end_infinite] bg-foreground align-text-bottom" />
            )}
          </div>
        )}
      </div>

      <span className="px-1 text-[11px] text-muted-foreground">
        {isUser ? "You" : `Assistant${message.toolCall ? " · Agent" : ""}`}
      </span>
    </div>
  );
};

const ToolPill = ({ name, done }: { name: string; done: boolean }) => (
  <div className="flex items-center gap-1.5 rounded-full border bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
    {done ? (
      <Check size={12} className="text-green-500" />
    ) : (
      <Wrench size={12} className="animate-pulse" />
    )}
    {TOOL_LABELS[name] ?? name}
  </div>
);

export const EmptyState = () => (
  <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
    <Bot size={32} className="text-muted-foreground/40" />
    <p className="text-sm text-muted-foreground">
      Select files from the PR and ask a question
    </p>
  </div>
);
