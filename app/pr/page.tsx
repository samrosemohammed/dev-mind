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
    <div className="h-dvh overflow-hidden">
      <ResizablePanelGroup className="h-full" orientation="horizontal">
        <ResizablePanel
          defaultSize={15}
          className="h-full min-h-0 overflow-hidden p-2"
        >
          {/* File tree — narrow */}
          <FileTree />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          defaultSize={65}
          className="h-full min-h-0 overflow-hidden"
        >
          {/* Code — wide */}
          <Code />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          defaultSize={20}
          className="h-full min-h-0 overflow-hidden"
        >
          {/* Chat — medium */}
          <Chat />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default PR;
