"use client";
import CodeMirror from "@uiw/react-codemirror";
import { useTheme } from "next-themes";
import { createTheme } from "@uiw/codemirror-themes";
import { tags as t } from "@lezer/highlight";
import { useMemo } from "react";
import { Language } from "@/types/github";
import { detectLanguage, getLanguageExtension } from "@/lib/utils";

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
