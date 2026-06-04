import { EXT_TO_LANG, Language } from "@/types/github";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
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

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const detectLanguage = (filename: string): Language => {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  return EXT_TO_LANG[ext] ?? "text";
};

export const getLanguageExtension = (lang: Language) => {
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
};
