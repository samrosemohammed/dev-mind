"use client";
import { Badge } from "@/components/ui/badge";
import { usePRContext } from "@/context/provider";
import { X } from "lucide-react";

export const FileTabsRow = () => {
  const { selectedFiles, activeFile, setActiveFile, removeFile } =
    usePRContext();

  if (!selectedFiles.length) return null;

  return (
    <>
      {selectedFiles.map((file) => {
        const isActive = file.filename === activeFile?.filename;
        const name = file.filename.split("/").slice(-1)[0];

        return (
          <Badge
            key={file.filename}
            variant={isActive ? "default" : "outline"}
            onClick={() => setActiveFile(file)}
            className="cursor-pointer"
          >
            {name}
            <X
              onClick={(e) => {
                e.stopPropagation();
                removeFile(file);
              }}
            />
          </Badge>
        );
      })}
    </>
  );
};
