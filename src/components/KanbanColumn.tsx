import { Droppable } from "@hello-pangea/dnd";
import { Plus } from "lucide-react";
import type { Task } from "@/hooks/useTasks";
import { TaskCard } from "./TaskCard";

const statusConfig = {
  todo: { label: "To-do", dotColor: "bg-kanban-todo" },
  in_progress: { label: "In Progress", dotColor: "bg-kanban-progress" },
  done: { label: "Completed", dotColor: "bg-kanban-done" },
};

interface KanbanColumnProps {
  status: string;
  tasks: Task[];
  onAddTask: (status: string) => void;
  onDeleteTask: (id: string) => void;
}

export function KanbanColumn({ status, tasks, onAddTask, onDeleteTask }: KanbanColumnProps) {
  const config = statusConfig[status as keyof typeof statusConfig] || { label: status, dotColor: "bg-muted-foreground" };

  return (
    <div className="flex-1 min-w-[300px] max-w-[380px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2.5">
          <div className={`w-2.5 h-2.5 rounded-full ${config.dotColor}`} />
          <h2 className="text-sm font-semibold text-foreground">{config.label}</h2>
          <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAddTask(status)}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Droppable area */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`space-y-3 min-h-[200px] p-2 rounded-xl transition-colors duration-200 ${
              snapshot.isDraggingOver ? "bg-primary/5 border-2 border-dashed border-primary/20" : ""
            }`}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} onDelete={onDeleteTask} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
