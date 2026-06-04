"use client";
import ReactDiffViewer from "react-diff-viewer-continued";
import { parsePatch } from "@/lib/parse-patch";
import { usePRContext } from "@/context/provider";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import { useTheme } from "next-themes";
import { CodeEditor } from "./code-editor";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const Code = () => {
  const { selectedFiles, activeFile, setActiveFile, removeFile } =
    usePRContext();
  const [editMode, setEditMode] = useState(false);
  const { resolvedTheme } = useTheme();
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
      <ScrollArea className="shrink-0">
        <div className="flex justify- border-b bg-muted shrink-0 min-w-max">
          {selectedFiles.map((file) => {
            const isActive = file.filename === activeFile?.filename;
            const name = file.filename.split("/").pop();
            return (
              <div
                key={file.filename}
                onClick={() => setActiveFile(file)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono cursor-pointer border-r whitespace-nowrap
                ${isActive ? "bg-background" : "hover:bg-muted-foreground/10 text-muted-foreground"}`}
              >
                {name}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(file);
                  }}
                  className="hover:text-foreground ml-1 cursor-pointer text-muted-foreground"
                >
                  <X size={12} />
                </button>
              </div>
            );
          })}

          <button
            onClick={() => selectedFiles.forEach((file) => removeFile(file))}
            className="cursor-pointer px-3 py-2 text-xs text-muted-foreground hover:text-foreground whitespace-nowrap border-r"
          >
            Clear all
          </button>
        </div>
        <ScrollBar className="cursor-pointer" orientation="horizontal" />
      </ScrollArea>

      {/* Filename + stats bar */}
      {activeFile && (
        <div className="flex justify-between shrink-0 border-b bg-muted px-4 py-2 text-sm font-mono">
          <div>
            {activeFile.filename}
            <span className="ml-3 text-xs text-muted-foreground">
              <span className="text-green-500">+{activeFile.additions}</span>{" "}
              <span className="text-red-500">-{activeFile.deletions}</span>
            </span>
          </div>
          <ButtonGroup aria-label="Button group">
            <Button
              className="text-xs cursor-pointer"
              size="sm"
              onClick={() => setEditMode(false)}
              variant={editMode ? "outline" : "default"}
            >
              Diff
            </Button>
            <Button
              className="text-xs cursor-pointer"
              size="sm"
              onClick={() => setEditMode(true)}
              variant={!editMode ? "outline" : "default"}
            >
              Edit
            </Button>
          </ButtonGroup>
        </div>
      )}

      <ScrollArea className="min-h-0 flex-1">
        {editMode ? (
          <CodeEditor
            key={`${activeFile?.filename ?? "empty"}:${activeFile?.patch ?? ""}`}
            value={newCode}
            filename={activeFile?.filename}
            readOnly
            minHeight="calc(100vh - 120px)"
          />
        ) : (
          <ReactDiffViewer
            key={`${activeFile?.filename ?? "empty"}:${activeFile?.patch ?? ""}`}
            oldValue={oldCode}
            newValue={newCode}
            splitView={true}
            leftTitle="Before"
            rightTitle="After"
            useDarkTheme={resolvedTheme === "dark"}
          />
        )}
      </ScrollArea>
    </div>
  );
};
