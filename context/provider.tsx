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
  selectedFile: PRFile | null;
  setSelectedFile: (file: PRFile) => void;
}

const PRContext = createContext<PRContextType | null>(null);

export const PRProvider = ({ children }: { children: ReactNode }) => {
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<PRFile | null>(null);
  const { data: files, isLoading: isLoadingFiles } = useQuery({
    queryKey: ["pr-diff", submittedUrl],
    queryFn: () =>
      fetch(
        `/api/github/pr/diff?url=${encodeURIComponent(submittedUrl!)}`,
      ).then((r) => r.json()),
    enabled: !!submittedUrl,
  });

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
        selectedFile,
        setSelectedFile,
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
