import { Draggable } from "@hello-pangea/dnd";
import { Calendar, Flag, MoreHorizontal, Trash2 } from "lucide-react";
import type { Task } from "@/hooks/useTasks";
import { useState } from "react";

const priorityConfig = {
  high: { color: "text-red-400", border: "border-l-red-500", glow: "shadow-red-500/10", label: "High" },
  medium: { color: "text-amber-400", border: "border-l-amber-500", glow: "shadow-amber-500/10", label: "Medium" },
  low: { color: "text-emerald-400", border: "border-l-emerald-500", glow: "shadow-emerald-500/10", label: "Low" },
};

const categoryColors: Record<string, string> = {
  Design: "bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-pink-400 ring-1 ring-pink-500/20",
  Development: "bg-gradient-to-r from-violet-500/20 to-indigo-500/20 text-violet-400 ring-1 ring-violet-500/20",
  DevOps: "bg-gradient-to-r from-sky-500/20 to-cyan-500/20 text-sky-400 ring-1 ring-sky-500/20",
  Documentation: "bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-400 ring-1 ring-amber-500/20",
  Media: "bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-400 ring-1 ring-orange-500/20",
  General: "bg-muted/50 text-muted-foreground ring-1 ring-border",
};

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase();
}

function getAvatarGradient(name: string) {
  const gradients = [
    "bg-gradient-to-br from-violet-500 to-purple-600",
    "bg-gradient-to-br from-sky-400 to-blue-600",
    "bg-gradient-to-br from-pink-500 to-rose-600",
    "bg-gradient-to-br from-amber-400 to-orange-600",
    "bg-gradient-to-br from-emerald-400 to-teal-600",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return gradients[Math.abs(hash) % gradients.length];
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
          className={`relative bg-card rounded-xl p-4 border-l-[3px] ${priority.border} border border-border/40 transition-all duration-300 animate-fade-in group overflow-hidden ${
            snapshot.isDragging
              ? `shadow-2xl ${priority.glow} rotate-2 scale-105 border-primary/40 z-50`
              : "hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 hover:border-primary/20"
          }`}
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent pointer-events-none rounded-xl" />

          {/* Top row */}
          <div className="relative flex items-start justify-between mb-3">
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${catClass}`}>
              {task.category}
            </span>
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-1 rounded-md hover:bg-muted"
              >
                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-xl shadow-black/10 py-1 z-10 min-w-[120px]">
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
          <h3 className="relative text-sm font-semibold text-card-foreground mb-2 leading-snug">{task.title}</h3>

          {/* Description preview */}
          {task.description && (
            <p className="relative text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed">{task.description}</p>
          )}

          {/* Meta row */}
          <div className="relative flex items-center gap-3 text-xs text-muted-foreground mb-3">
            {task.due_date && (
              <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-0.5 rounded-md">
                <Calendar className="w-3 h-3" />
                {new Date(task.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            )}
            <span className={`flex items-center gap-1.5 ${priority.color}`}>
              <Flag className="w-3 h-3" />
              {priority.label}
            </span>
          </div>

          {/* Assignee */}
          {task.assignee_name && (
            <div className="relative flex items-center gap-2 pt-2 border-t border-border/30">
              <div className={`w-6 h-6 rounded-full ${getAvatarGradient(task.assignee_name)} flex items-center justify-center shadow-sm`}>
                <span className="text-[10px] font-bold text-white">{getInitials(task.assignee_name)}</span>
              </div>
              <span className="text-xs text-muted-foreground font-medium">{task.assignee_name}</span>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}
