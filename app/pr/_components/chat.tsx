import ChatInput from "./chat-input";
import { ScrollArea } from "@/components/ui/scroll-area";

export const Chat = () => {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      {/* Header — fixed height */}
      <div className="shrink-0 border-b p-4">Chat 1</div>

      {/* Messages — grows to fill space, scrolls internally */}
      <ScrollArea className="min-h-0 flex-1">
        <div className="p-4">Message</div>
      </ScrollArea>

      {/* Input — sticks to bottom */}
      <ChatInput />
    </div>
  );
};
