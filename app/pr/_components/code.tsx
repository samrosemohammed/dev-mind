"use client";
import ReactDiffViewer from "react-diff-viewer-continued";
import { parsePatch } from "@/lib/parse-patch";
import { usePRContext } from "@/context/provider";

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
    <div className="">
      <div className="px-4 py-2 bg-muted text-sm font-mono border-b">
        {selectedFile.filename}
        <span className="ml-3 text-xs text-muted-foreground">
          <span className="text-green-500">+{selectedFile.additions}</span>{" "}
          <span className="text-red-500">-{selectedFile.deletions}</span>
        </span>
      </div>
      <ReactDiffViewer
        oldValue={oldCode}
        newValue={newCode}
        splitView={true}
        leftTitle="Before"
        rightTitle="After"
      />
    </div>
  );
};
