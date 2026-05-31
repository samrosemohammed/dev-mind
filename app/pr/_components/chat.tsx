"use client";
import ChatInput from "./chat-input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./message-bubble";
import { useRef, useEffect } from "react";
import { useChatContext } from "@/context/provider";

export const Chat = () => {
  const { messages, isStreaming } = useChatContext();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="shrink-0 border-b p-4">Chat 1</div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col gap-2 p-4">
          {messages.length === 0 && (
            <p className="text-center text-sm text-muted-foreground mt-8">
              Select files and ask a question
            </p>
          )}
          {messages.map((msg, i) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isStreaming={isStreaming && i === messages.length - 1}
            />
          ))}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <ChatInput />
    </div>
  );
};
