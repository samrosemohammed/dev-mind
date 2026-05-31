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
          <div key={file.filename}>
            <Badge
              variant={isActive ? "default" : "outline"}
              onClick={() => setActiveFile(file)}
              className="cursor-pointer"
            >
              {name}
              <X
                size={12}
                className="ml-1 cursor-pointer hover:opacity-70"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  removeFile(file);
                }}
              />
            </Badge>
          </div>
        );
      })}
    </>
  );
};
