"use client";
import { Tree, Folder, File } from "@/components/ui/file-tree";
import type { TreeViewElement } from "@/components/ui/file-tree";
import { usePRContext } from "@/context/provider";
import { PRFile } from "@/types/github";

// Build nested tree from flat file paths
const buildTree = (files: PRFile[]): TreeViewElement[] => {
  const map: Record<string, TreeViewElement> = {};

  const getOrCreate = (id: string, name: string, isFolder: boolean) => {
    if (!map[id]) {
      map[id] = {
        id,
        name,
        isSelectable: true,
        ...(isFolder ? { type: "folder", children: [] } : {}),
      };
    }
    return map[id];
  };

  const roots: TreeViewElement[] = [];
  const addedToParent = new Set<string>();

  files.forEach((file) => {
    const parts = file.filename.split("/");

    parts.forEach((part, index) => {
      const id = parts.slice(0, index + 1).join("/");
      const isFolder = index < parts.length - 1;
      const node = getOrCreate(id, part, isFolder);

      if (index === 0) {
        if (!addedToParent.has(id)) {
          roots.push(node);
          addedToParent.add(id);
        }
      } else {
        const parentId = parts.slice(0, index).join("/");
        const parent = map[parentId];
        if (parent?.children && !addedToParent.has(id)) {
          parent.children.push(node);
          addedToParent.add(id);
        }
      }
    });
  });

  return roots;
};

const statusColor: Record<string, string> = {
  added: "text-green-500",
  removed: "text-red-500",
  modified: "text-yellow-500",
  renamed: "text-blue-500",
};

const renderTree = (
  elements: TreeViewElement[],
  files: PRFile[],
  setSelectedFile: (file: PRFile) => void, // add param
) => {
  return elements.map((el) => {
    if (el.type === "folder") {
      return (
        <Folder key={el.id} element={el.name} value={el.id}>
          {el.children && renderTree(el.children, files, setSelectedFile)}
        </Folder>
      );
    }

    const fileData = files.find((f) => f.filename === el.id);
    const colorClass = statusColor[fileData?.status ?? ""] ?? "";

    return (
      <File
        key={el.id}
        value={el.id}
        onClick={() => fileData && setSelectedFile(fileData)} // add this
      >
        <span className={colorClass}>{el.name}</span>
      </File>
    );
  });
};

export const FileTree = () => {
  const { files, isLoadingFiles, submittedUrl, setSelectedFile } =
    usePRContext();

  if (!submittedUrl)
    return (
      <p className="text-sm text-muted-foreground">
        Submit a PR URL to view changed files.
      </p>
    );

  if (isLoadingFiles)
    return (
      <p className="text-sm text-muted-foreground animate-pulse">
        Loading files...
      </p>
    );

  if (!files?.length)
    return <p className="text-sm text-muted-foreground">No files changed.</p>;

  const treeData = buildTree(files);
  const allFolderIds = Array.from(
    new Set(
      files.flatMap((f) => {
        const parts = f.filename.split("/");
        return parts
          .slice(0, -1)
          .map((_, i) => parts.slice(0, i + 1).join("/"));
      }),
    ),
  );

  return (
    <Tree
      initialSelectedId={files[0]?.filename}
      initialExpandedItems={[...new Set(allFolderIds)]}
      elements={treeData}
    >
      {renderTree(treeData, files, setSelectedFile)}
    </Tree>
  );
};
