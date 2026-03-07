import { LayoutDashboard, CheckSquare, MessageCircle, Settings } from "lucide-react";

interface AppSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const navItems = [
  { id: "board", icon: LayoutDashboard, label: "Board" },
  { id: "chat", icon: MessageCircle, label: "AI Chat" },
];

export function AppSidebar({ activeView, onViewChange }: AppSidebarProps) {
  return (
    <div className="w-16 bg-sidebar flex flex-col items-center py-6 gap-2">
      {/* Logo */}
      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center mb-8">
        <CheckSquare className="w-5 h-5 text-primary-foreground" />
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 group relative ${
                isActive
                  ? "bg-sidebar-active text-primary-foreground shadow-lg shadow-primary/30"
                  : "text-sidebar-foreground hover:bg-sidebar-hover"
              }`}
              title={item.label}
            >
              <item.icon className="w-5 h-5" />
              {/* Tooltip */}
              <span className="absolute left-full ml-3 px-2 py-1 rounded-md bg-foreground text-background text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Settings */}
      <button className="w-12 h-12 rounded-xl flex items-center justify-center text-sidebar-foreground hover:bg-sidebar-hover transition-colors" title="Settings">
        <Settings className="w-5 h-5" />
      </button>
    </div>
  );
}
