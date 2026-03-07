import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { KanbanBoard } from "@/components/KanbanBoard";
import { AIChatPanel } from "@/components/AIChatPanel";

const Index = () => {
  const [activeView, setActiveView] = useState("board");

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar activeView={activeView} onViewChange={setActiveView} />
      <div className="flex-1 flex">
        {activeView === "board" && <KanbanBoard />}
        {activeView === "chat" && <AIChatPanel onBack={() => setActiveView("board")} />}
      </div>
    </div>
  );
};

export default Index;
