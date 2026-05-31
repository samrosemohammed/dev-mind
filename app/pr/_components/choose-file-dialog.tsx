"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FieldError,
  FieldGroup,
  FieldLabel,
  Field,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { usePRContext } from "@/context/provider";
import { searchFile } from "@/schemas/pr";
import { useForm } from "@tanstack/react-form";
import { Plus, FileCode, Search } from "lucide-react";
import { useState, useMemo } from "react";

export const ChooseFileDialog = () => {
  const { files, isLoadingFiles, submittedUrl } = usePRContext();
  const [query, setQuery] = useState("");

  const filteredFiles = useMemo(() => {
    if (!files?.length) return [];
    if (!query.trim()) return files;
    const lower = query.toLowerCase();
    return files.filter((file) => file.filename.toLowerCase().includes(lower));
  }, [files, query]);

  const form = useForm({
    defaultValues: { query: "" },
    validators: { onSubmit: searchFile },
    onSubmit: async ({ value }) => {
      console.log("Searching for file:", value.query);
    },
  });

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) setQuery("");
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
        >
          <Plus size={15} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Search for a file in this PR</DialogTitle>
          <DialogDescription>
            Enter the name of the file you want to find.
          </DialogDescription>
        </DialogHeader>

        {!files?.length ? (
          <p className="text-sm text-muted-foreground py-2">
            No files found in this PR. Please check the PR URL and try again.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {/* Search input — live filtering, no submit needed */}
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
              <Input
                autoFocus
                placeholder="e.g. src/components/button.tsx"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-8"
              />
            </div>

            {/* Results list */}
            <div className="flex flex-col max-h-72 overflow-y-auto rounded-md border divide-y">
              {filteredFiles.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No files match &ldquo;{query}&rdquo;
                </p>
              ) : (
                filteredFiles.map((file) => {
                  const parts = file.filename.split("/");
                  const name = parts.pop()!;
                  const dir = parts.join("/");

                  return (
                    <button
                      key={file.sha}
                      type="button"
                      onClick={() => {
                        // TODO: handle file selection
                        console.log("Selected file:", file);
                      }}
                      className="flex items-center gap-3 px-3 py-2.5 text-left hover:bg-muted/50 transition-colors group"
                    >
                      <FileCode
                        size={14}
                        className="shrink-0 text-muted-foreground group-hover:text-foreground transition-colors"
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium truncate leading-tight">
                          {name}
                        </span>
                        {dir && (
                          <span className="text-xs text-muted-foreground truncate leading-tight">
                            {dir}
                          </span>
                        )}
                      </div>
                      <span
                        className={`ml-auto text-xs shrink-0 px-1.5 py-0.5 rounded font-mono ${
                          file.status === "added"
                            ? "bg-green-500/10 text-green-600"
                            : file.status === "removed"
                              ? "bg-red-500/10 text-red-600"
                              : "bg-yellow-500/10 text-yellow-600"
                        }`}
                      >
                        {file.status}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer count */}
            <p className="text-xs text-muted-foreground">
              {filteredFiles.length} of {files.length} file
              {files.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
