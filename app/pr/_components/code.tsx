"use client";
import ReactDiffViewer from "react-diff-viewer-continued";
import { parsePatch } from "@/lib/parse-patch";
import { usePRContext } from "@/context/provider";
import { ScrollArea } from "@/components/ui/scroll-area";

export const Code = () => {
  const { selectedFile } = usePRContext();

  if (!selectedFile)
    return (
      <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
        Select a file to view changes
      </div>
    );

  const { oldCode, newCode } = parsePatch(selectedFile.patch ?? "");

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="shrink-0 border-b bg-muted px-4 py-2 text-sm font-mono">
        {selectedFile.filename}
        <span className="ml-3 text-xs text-muted-foreground">
          <span className="text-green-500">+{selectedFile.additions}</span>{" "}
          <span className="text-red-500">-{selectedFile.deletions}</span>
        </span>
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <ReactDiffViewer
          oldValue={oldCode}
          newValue={newCode}
          splitView={true}
          leftTitle="Before"
          rightTitle="After"
        />
      </ScrollArea>
    </div>
  );
};
