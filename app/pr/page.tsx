import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { FileTree } from "./_components/file-tree";
import { Code } from "./_components/code";
import { Chat } from "./_components/chat";

const PR = () => {
  return (
    <ResizablePanelGroup className="min-h-screen" orientation="horizontal">
      <ResizablePanel defaultSize={15} className="p-2 fixed">
        {/* File tree — narrow */}
        <FileTree />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={65}>
        {/* Code — wide */}
        <Code />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={20}>
        {/* Chat — medium */}
        <Chat />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default PR;
