"use client";

import { useEffect, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useChatContext } from "@/context/provider";
import { PanelLeft, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { FileTree } from "./file-tree";
import { Code } from "./code";
import { Chat } from "./chat";

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [breakpoint]);

  return isMobile;
}

function MobileLayout() {
  const [fileTreeOpen, setFileTreeOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const { isStreaming } = useChatContext();

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <div className="flex shrink-0 items-center justify-between border-b px-1 py-1">
        <Sheet open={fileTreeOpen} onOpenChange={setFileTreeOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open file tree">
              <PanelLeft size={18} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetTitle className="sr-only">File tree</SheetTitle>
            <div className="h-full min-h-0 overflow-y-auto px-1 py-2">
              <FileTree onSelectFile={() => setFileTreeOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>

        <span className="truncate px-2 text-xs font-medium text-muted-foreground">
          PR Review
        </span>

        <Sheet open={chatOpen} onOpenChange={setChatOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open chat"
              className="relative"
            >
              <MessageSquare size={18} />
              {isStreaming && !chatOpen ? (
                <span
                  className={cn(
                    "absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary",
                    "animate-pulse",
                  )}
                />
              ) : null}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full p-0 sm:max-w-full">
            <SheetTitle className="sr-only">Chat</SheetTitle>
            <div className="h-full min-h-0 overflow-hidden">
              <Chat />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        <Code />
      </div>
    </div>
  );
}

export default function PRShell() {
  const isMobile = useIsMobile();

  if (isMobile === null) {
    return <div className="h-dvh" />;
  }

  if (isMobile) {
    return <MobileLayout />;
  }

  return (
    <div className="h-dvh overflow-hidden">
      <ResizablePanelGroup className="h-full" orientation="horizontal">
        <ResizablePanel
          defaultSize={15}
          minSize={10}
          className="h-full min-h-0 overflow-hidden py-2"
        >
          <FileTree />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel
          defaultSize={60}
          minSize={30}
          className="h-full min-h-0 overflow-hidden"
        >
          <Code />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel
          defaultSize={25}
          minSize={15}
          className="h-full min-h-0 overflow-hidden"
        >
          <Chat />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
