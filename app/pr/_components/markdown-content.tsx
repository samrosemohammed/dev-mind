import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";

export const MarkdownContent = ({
  content,
  className,
}: {
  content: string;
  className?: string;
}) => {
  return (
    <div className={cn("prose prose-sm dark:prose-invert max-w-sm", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Code blocks — inline vs fenced
          code({ className, children }) {
            const isInline = !className;
            const language = className?.replace("language-", "") ?? "text";
            const { resolvedTheme } = useTheme();

            if (isInline) {
              return (
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                  {children}
                </code>
              );
            }

            return (
              <div className="my-3 overflow-hidden rounded-lg border text-xs">
                <div className="flex items-center justify-between border-b bg-muted px-3 py-1.5">
                  <span className="text-xs text-muted-foreground">
                    {language}
                  </span>
                </div>
                <SyntaxHighlighter
                  language={language}
                  style={resolvedTheme === "dark" ? oneDark : oneLight}
                  customStyle={{
                    margin: 0,
                    background: "transparent",
                    fontSize: "12px",
                  }}
                  PreTag="div"
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              </div>
            );
          },

          // Headings
          h1: ({ children }) => (
            <h1 className="mb-2 mt-4 text-base font-semibold">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-1.5 mt-3 text-sm font-semibold">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-1 mt-2 text-sm font-medium">{children}</h3>
          ),

          // Lists
          ul: ({ children }) => (
            <ul className="my-2 ml-4 list-disc space-y-1 text-sm">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-2 ml-4 list-decimal space-y-1 text-sm">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,

          // Paragraph
          p: ({ children }) => (
            <p className="mb-2 text-sm leading-relaxed last:mb-0">{children}</p>
          ),

          // Blockquote — good for LLM "note:" callouts
          blockquote: ({ children }) => (
            <blockquote className="my-2 border-l-2 border-muted-foreground/30 pl-3 text-muted-foreground">
              {children}
            </blockquote>
          ),

          // Tables (remark-gfm)
          table: ({ children }) => (
            <div className="my-3 overflow-x-auto rounded-lg border">
              <table className="w-full text-xs">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border-b bg-muted px-3 py-2 text-left font-medium">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b px-3 py-2 last:border-0">{children}</td>
          ),

          // Horizontal rule
          hr: () => <hr className="my-3 border-border" />,

          // Bold / italic
          strong: ({ children }) => (
            <strong className="font-semibold">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-muted-foreground">{children}</em>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
