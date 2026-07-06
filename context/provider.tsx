"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { PRFile } from "@/types/github";
import { ChatMessage, ChatMode } from "@/types/chat";
import { nanoid } from "nanoid";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export const TanstackQueryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

interface PRContextType {
  submittedUrl: string | null;
  setSubmittedUrl: (url: string) => void;
  files: PRFile[] | undefined;
  isLoadingFiles: boolean;
  // reviewData: { review: string } | undefined;
  // isReviewing: boolean;
  selectedFiles: PRFile[];
  setSelectedFile: (file: PRFile) => void; // keep same name, change behavior
  activeFile: PRFile | null;
  setActiveFile: (file: PRFile) => void;
  removeFile: (file: PRFile) => void;
}

const PRContext = createContext<PRContextType | null>(null);

export const PRProvider = ({ children }: { children: ReactNode }) => {
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<PRFile[]>([]);
  const [activeFile, setActiveFile] = useState<PRFile | null>(null);
  const { data: files, isLoading: isLoadingFiles } = useQuery({
    queryKey: ["pr-diff", submittedUrl],
    queryFn: () =>
      fetch(
        `/api/github/pr/diff?url=${encodeURIComponent(submittedUrl!)}`,
      ).then((r) => r.json()),
    enabled: !!submittedUrl,
  });

  const setSelectedFile = (file: PRFile) => {
    setSelectedFiles((prev) => {
      const exists = prev.find((f) => f.filename === file.filename);
      if (exists) return prev; // already open, just activate
      return [...prev, file];
    });
    setActiveFile(file); // always make clicked file active
  };

  const removeFile = (file: PRFile) => {
    setSelectedFiles((prev) => {
      const next = prev.filter((f) => f.filename !== file.filename);
      // If we removed the active tab, activate the nearest one
      if (activeFile?.filename === file.filename) {
        const idx = prev.findIndex((f) => f.filename === file.filename);
        setActiveFile(next[idx] ?? next[idx - 1] ?? null);
      }
      return next;
    });
  };
  // const { data: reviewData, isLoading: isReviewing } = useQuery({
  //   queryKey: ["pr-review", submittedUrl],
  //   queryFn: async () => {
  //     const res = await fetch("/api/github/pr/review", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ files }),
  //     });
  //     return res.json();
  //   },
  //   enabled: !!files && files.length > 0,
  // });

  console.log(files);
  return (
    <PRContext.Provider
      value={{
        submittedUrl,
        setSubmittedUrl,
        files,
        isLoadingFiles,
        // reviewData,
        // isReviewing,
        selectedFiles,
        setSelectedFile,
        activeFile,
        setActiveFile,
        removeFile,
      }}
    >
      {children}
    </PRContext.Provider>
  );
};

export const usePRContext = () => {
  const ctx = useContext(PRContext);
  if (!ctx) throw new Error("usePRContext must be used within PRProvider");
  return ctx;
};

interface ChatContextType {
  messages: ChatMessage[];
  mode: ChatMode;
  setMode: (m: ChatMode) => void;
  isStreaming: boolean;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [mode, setMode] = useState<ChatMode>("ask");
  const [isStreaming, setIsStreaming] = useState(false);
  const { selectedFiles, submittedUrl } = usePRContext();

  const sendMessage = useCallback(
    async (content: string) => {
      const userMsg: ChatMessage = {
        id: nanoid(),
        role: "user",
        content,
        createdAt: new Date(),
      };
      const assistantMsg: ChatMessage = {
        id: nanoid(),
        role: "assistant",
        content: "",
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setIsStreaming(true);

      try {
        // Build history (exclude the empty assistant placeholder)
        const history = [...messages, userMsg].map((m) => ({
          role: m.role === "tool" ? "user" : m.role, // flatten tools for ask mode
          content: m.content,
        }));

        const prMeta = parsePrUrl(submittedUrl ?? "");
        const endpoint = mode === "agent" ? "/api/chat/agent" : "/api/chat/ask";

        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history, selectedFiles, prMeta }),
        });

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          accumulated += chunk;

          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsg.id
                ? { ...m, content: accumulated.replace(/__TOOL__:\w+\n/g, "") }
                : m,
            ),
          );
        }
      } finally {
        setIsStreaming(false);
      }
    },
    [messages, mode, selectedFiles, submittedUrl],
  );

  const clearMessages = () => setMessages([]);

  return (
    <ChatContext.Provider
      value={{
        messages,
        mode,
        setMode,
        isStreaming,
        sendMessage,
        clearMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

function parsePrUrl(url: string) {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/);
  if (!match) return { owner: "", repo: "", pull_number: 0 };
  return { owner: match[1], repo: match[2], pull_number: Number(match[3]) };
}

export const useChatContext = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChatContext must be used within ChatProvider");
  return ctx;
};

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
