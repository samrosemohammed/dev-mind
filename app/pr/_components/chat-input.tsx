"use client";
import { useState, useRef, useEffect } from "react";
import {
  Plus,
  Zap,
  SlidersHorizontal,
  ArrowUp,
  X,
  MessageCircle,
  BotMessageSquare,
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChooseFileDialog } from "./choose-file-dialog";
import { FileTabsRow } from "./file-tab-row";
import { useChatContext } from "@/context/provider";
import { ChatMode } from "@/types/chat";
import { useTheme } from "next-themes";

interface FileTab {
  id: string;
  name: string;
}

export default function ChatInput() {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessage, isStreaming, mode, setMode } = useChatContext();
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  }, [value]);

  const handleSend = async () => {
    if (!value.trim() || isStreaming) return;
    const msg = value;
    setValue("");
    await sendMessage(msg);
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleThemeToggle = () => {
    setTheme(resolvedTheme === "light" ? "dark" : "light");
  };

  return (
    <div className="p-4 border-t shrink-0">
      <div className="rounded-xl border bg-background shadow-sm focus-within:ring-1 focus-within:ring-ring overflow-hidden">
        {/* Top: file tabs row */}
        <div className="flex items-center gap-1.5 px-3 pt-2.5 pb-1 flex-wrap">
          <FileTabsRow />
        </div>

        {/* Middle: textarea */}
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe what to build"
          rows={3}
          className="max-h-12.5 resize-none border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground/60"
        />

        {/* Bottom toolbar */}
        <div className="flex items-center gap-1 px-2 pb-2 pt-1">
          {/* Left actions */}
          <ChooseFileDialog />

          <Separator orientation="vertical" className="h-4 mt-2 mx-0.5" />

          <Select value={mode} onValueChange={(v) => setMode(v as ChatMode)}>
            <SelectTrigger className="h-7 w-auto gap-1 border-0 bg-transparent px-2 text-xs text-muted-foreground shadow-none hover:text-foreground focus:ring-0 focus:ring-offset-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ask" className="text-xs">
                <MessageCircle /> Ask
              </SelectItem>
              <SelectItem value="agent" className="text-xs">
                <BotMessageSquare /> Agent
              </SelectItem>
            </SelectContent>
          </Select>
          <Separator orientation="vertical" className="h-4 mt-2 mx-0.5" />

          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={handleThemeToggle}
          >
            {resolvedTheme === "light" ? <Moon size={14} /> : <Sun size={14} />}
          </Button>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Send */}
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!value.trim()}
            className="h-7 w-7 rounded-lg disabled:opacity-30"
          >
            <ArrowUp size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}
