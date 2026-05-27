import ChatInput from "./chat-input";

export const Chat = () => {
  return (
    <div className="h-full flex flex-col">
      {/* Header — fixed height */}
      <div className="p-4 border-b shrink-0">Chat 1</div>

      {/* Messages — grows to fill space, scrolls internally */}
      <div className="flex-1 overflow-y-auto p-4">Message</div>

      {/* Input — sticks to bottom */}
      <ChatInput />
    </div>
  );
};
