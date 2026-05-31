"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { createContext, useContext, useState, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { PRFile } from "@/types/github";

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
