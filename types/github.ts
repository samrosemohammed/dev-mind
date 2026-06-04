import type { Endpoints } from "@octokit/types";

export type PRFiles =
  Endpoints["GET /repos/{owner}/{repo}/pulls/{pull_number}/files"]["response"]["data"];
export type PRFile = PRFiles[number];

export type Language =
  | "javascript"
  | "typescript"
  | "jsx"
  | "tsx"
  | "python"
  | "css"
  | "html"
  | "json"
  | "markdown"
  | "sql"
  | "rust"
  | "go"
  | "java"
  | "cpp"
  | "c"
  | "php"
  | "xml"
  | "yaml"
  | "shell"
  | "text";

export const EXT_TO_LANG: Record<string, Language> = {
  js: "javascript",
  mjs: "javascript",
  cjs: "javascript",
  ts: "typescript",
  jsx: "jsx",
  tsx: "tsx",
  py: "python",
  css: "css",
  scss: "css",
  less: "css",
  html: "html",
  htm: "html",
  json: "json",
  jsonc: "json",
  md: "markdown",
  mdx: "markdown",
  sql: "sql",
  rs: "rust",
  go: "go",
  java: "java",
  cpp: "cpp",
  cc: "cpp",
  cxx: "cpp",
  c: "c",
  h: "c",
  php: "php",
  xml: "xml",
  svg: "xml",
  yaml: "yaml",
  yml: "yaml",
  sh: "shell",
  bash: "shell",
  zsh: "shell",
};
