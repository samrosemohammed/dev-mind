"use client";
import CodeMirror from "@uiw/react-codemirror";
import { useTheme } from "next-themes";
import { createTheme } from "@uiw/codemirror-themes";
import { tags as t } from "@lezer/highlight";
import { useMemo } from "react";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { json } from "@codemirror/lang-json";
import { markdown } from "@codemirror/lang-markdown";
import { sql } from "@codemirror/lang-sql";
import { rust } from "@codemirror/lang-rust";
import { go } from "@codemirror/lang-go";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { php } from "@codemirror/lang-php";
import { xml } from "@codemirror/lang-xml";
import { yaml } from "@codemirror/lang-yaml";
import { shell } from "@codemirror/legacy-modes/mode/shell";
import { StreamLanguage } from "@codemirror/language";

type Language =
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

const EXT_TO_LANG: Record<string, Language> = {
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

export function detectLanguage(filename: string): Language {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  return EXT_TO_LANG[ext] ?? "text";
}

function getLanguageExtension(lang: Language) {
  switch (lang) {
    case "javascript":
      return javascript({ jsx: false, typescript: false });
    case "typescript":
      return javascript({ jsx: false, typescript: true });
    case "jsx":
      return javascript({ jsx: true, typescript: false });
    case "tsx":
      return javascript({ jsx: true, typescript: true });
    case "python":
      return python();
    case "css":
      return css();
    case "html":
      return html();
    case "json":
      return json();
    case "markdown":
      return markdown();
    case "sql":
      return sql();
    case "rust":
      return rust();
    case "go":
      return go();
    case "java":
      return java();
    case "cpp":
    case "c":
      return cpp();
    case "php":
      return php();
    case "xml":
      return xml();
    case "yaml":
      return yaml();
    case "shell":
      return StreamLanguage.define(shell);
    default:
      return [];
  }
}

const copilotDark = createTheme({
  theme: "dark",
  settings: {
    background: "#0d1117",
    foreground: "#c9d1d9",
    caret: "#79c0ff",
    selection: "#264f78",
    selectionMatch: "#264f78",
    gutterBackground: "#0d1117",
    gutterForeground: "#6e7681",
    gutterBorder: "transparent",
    gutterActiveForeground: "#c9d1d9",
    lineHighlight: "#161b22",
  },
  styles: [
    { tag: t.comment, color: "#8b949e", fontStyle: "italic" },
    { tag: t.keyword, color: "#ff7b72" },
    { tag: t.string, color: "#a5d6ff" },
    { tag: t.variableName, color: "#c9d1d9" },
    { tag: t.number, color: "#79c0ff" },
    { tag: t.bool, color: "#79c0ff" },
    { tag: t.null, color: "#79c0ff" },
    { tag: t.operator, color: "#ff7b72" },
    { tag: t.punctuation, color: "#c9d1d9" },
    { tag: t.typeName, color: "#ffa657" },
    { tag: t.className, color: "#f0883e" },
    { tag: t.definition(t.variableName), color: "#d2a8ff" },
    { tag: t.function(t.variableName), color: "#d2a8ff" },
    { tag: t.propertyName, color: "#c9d1d9" },
    { tag: t.attributeName, color: "#7ee787" },
    { tag: t.attributeValue, color: "#a5d6ff" },
    { tag: t.tagName, color: "#7ee787" },
    { tag: t.heading, color: "#79c0ff", fontWeight: "bold" },
    { tag: t.emphasis, fontStyle: "italic" },
    { tag: t.strong, fontWeight: "bold" },
    { tag: t.link, color: "#a5d6ff", textDecoration: "underline" },
  ],
});

const copilotLight = createTheme({
  theme: "light",
  settings: {
    background: "#ffffff",
    foreground: "#24292f",
    caret: "#0969da",
    selection: "#add6ff",
    selectionMatch: "#add6ff",
    gutterBackground: "#ffffff",
    gutterForeground: "#8c959f",
    gutterBorder: "transparent",
    gutterActiveForeground: "#24292f",
    lineHighlight: "#f6f8fa",
  },
  styles: [
    { tag: t.comment, color: "#8c959f", fontStyle: "italic" },
    { tag: t.keyword, color: "#cf222e" },
    { tag: t.string, color: "#0a3069" },
    { tag: t.variableName, color: "#24292f" },
    { tag: t.number, color: "#0550ae" },
    { tag: t.bool, color: "#0550ae" },
    { tag: t.null, color: "#0550ae" },
    { tag: t.operator, color: "#cf222e" },
    { tag: t.punctuation, color: "#24292f" },
    { tag: t.typeName, color: "#953800" },
    { tag: t.className, color: "#953800" },
    { tag: t.definition(t.variableName), color: "#8250df" },
    { tag: t.function(t.variableName), color: "#8250df" },
    { tag: t.propertyName, color: "#24292f" },
    { tag: t.attributeName, color: "#116329" },
    { tag: t.attributeValue, color: "#0a3069" },
    { tag: t.tagName, color: "#116329" },
    { tag: t.heading, color: "#0550ae", fontWeight: "bold" },
    { tag: t.emphasis, fontStyle: "italic" },
    { tag: t.strong, fontWeight: "bold" },
    { tag: t.link, color: "#0a3069", textDecoration: "underline" },
  ],
});

interface CodeEditorProps {
  value?: string;
  language?: Language;
  filename?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  minHeight?: string;
  maxHeight?: string;
}

export const CodeEditor = ({
  value = `function add(a, b) {\n  return a + b;\n}`,
  language,
  filename,
  onChange,
  readOnly = false,
  minHeight = "200px",
  maxHeight,
}: CodeEditorProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const resolvedLang: Language =
    language ?? (filename ? detectLanguage(filename) : "text");

  const langExtension = useMemo(
    () => getLanguageExtension(resolvedLang),
    [resolvedLang],
  );

  return (
    <CodeMirror
      theme={isDark ? copilotDark : copilotLight}
      value={value}
      extensions={langExtension ? [langExtension] : []}
      onChange={onChange}
      readOnly={readOnly}
      basicSetup={{
        lineNumbers: true,
        foldGutter: true,
        highlightActiveLine: true,
        highlightSelectionMatches: true,
        autocompletion: true,
        bracketMatching: true,
        closeBrackets: true,
        indentOnInput: true,
      }}
      style={{ minHeight, maxHeight, overflow: maxHeight ? "auto" : undefined }}
    />
  );
};
