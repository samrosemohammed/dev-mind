"use client";
import ReactDiffViewer from "react-diff-viewer-continued";
import { parsePatch } from "@/lib/parse-patch";
import { usePRContext } from "@/context/provider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";

export const Code = () => {
  const { selectedFiles, activeFile, setActiveFile, removeFile } =
    usePRContext();

  if (!selectedFiles.length)
    return (
      <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
        Select a file to view changes
      </div>
    );
  const { oldCode, newCode } = parsePatch(activeFile?.patch ?? "");

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      {/* Tabs row */}
      <div className="flex overflow-x-auto border-b bg-muted shrink-0">
        {selectedFiles.map((file) => {
          const isActive = file.filename === activeFile?.filename;
          const name = file.filename.split("/").pop();
          return (
            <div
              key={file.filename}
              onClick={() => setActiveFile(file)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono cursor-pointer border-r whitespace-nowrap
                ${isActive ? "bg-background border-b-2 border-b-primary" : "hover:bg-muted-foreground/10 text-muted-foreground"}`}
            >
              {name}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(file);
                }}
                className="hover:text-foreground ml-1"
              >
                <X size={12} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Filename + stats bar */}
      {activeFile && (
        <div className="shrink-0 border-b bg-muted px-4 py-2 text-sm font-mono">
          {activeFile.filename}
          <span className="ml-3 text-xs text-muted-foreground">
            <span className="text-green-500">+{activeFile.additions}</span>{" "}
            <span className="text-red-500">-{activeFile.deletions}</span>
          </span>
        </div>
      )}

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
