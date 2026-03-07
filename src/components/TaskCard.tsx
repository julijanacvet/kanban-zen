import { Draggable } from "@hello-pangea/dnd";
import { Calendar, Flag, MoreHorizontal, Trash2 } from "lucide-react";
import type { Task } from "@/hooks/useTasks";
import { useState } from "react";

const priorityConfig = {
  high: { color: "text-red-500", bg: "bg-red-500/10", label: "High" },
  medium: { color: "text-amber-500", bg: "bg-amber-500/10", label: "Medium" },
  low: { color: "text-emerald-500", bg: "bg-emerald-500/10", label: "Low" },
};

const categoryColors: Record<string, string> = {
  Design: "bg-pink-500/15 text-pink-600",
  Development: "bg-violet-500/15 text-violet-600",
  DevOps: "bg-sky-500/15 text-sky-600",
  Documentation: "bg-amber-500/15 text-amber-600",
  Media: "bg-orange-500/15 text-orange-600",
  General: "bg-muted text-muted-foreground",
};

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase();
}

function getAvatarColor(name: string) {
  const colors = ["bg-violet-500", "bg-sky-500", "bg-pink-500", "bg-amber-500", "bg-emerald-500"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

interface TaskCardProps {
  task: Task;
  index: number;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, index, onDelete }: TaskCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const priority = priorityConfig[task.priority as keyof typeof priorityConfig] || priorityConfig.medium;
  const catClass = categoryColors[task.category] || categoryColors.General;

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-card rounded-xl p-4 shadow-sm border border-border/50 transition-all duration-200 animate-fade-in group ${
            snapshot.isDragging ? "shadow-xl rotate-2 scale-105 border-primary/30" : "hover:shadow-md hover:border-primary/20"
          }`}
        >
          {/* Top row */}
          <div className="flex items-start justify-between mb-3">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${catClass}`}>
              {task.category}
            </span>
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-muted"
              >
                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                  <button
                    onClick={() => { onDelete(task.id); setShowMenu(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold text-card-foreground mb-3 leading-snug">{task.title}</h3>

          {/* Meta row */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            {task.due_date && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(task.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            )}
            <span className={`flex items-center gap-1 ${priority.color}`}>
              <Flag className="w-3.5 h-3.5" />
              {priority.label}
            </span>
          </div>

          {/* Assignee */}
          {task.assignee_name && (
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full ${getAvatarColor(task.assignee_name)} flex items-center justify-center`}>
                <span className="text-[10px] font-bold text-primary-foreground">{getInitials(task.assignee_name)}</span>
              </div>
              <span className="text-xs text-muted-foreground">{task.assignee_name}</span>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}
