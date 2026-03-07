import { useState, useMemo } from "react";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { KanbanColumn } from "./KanbanColumn";
import { AddTaskDialog } from "./AddTaskDialog";
import { useTasks, useUpdateTask, useDeleteTask } from "@/hooks/useTasks";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";

const columns = ["todo", "in_progress", "done"];

export function KanbanBoard() {
  const { data: tasks = [], isLoading } = useTasks();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogStatus, setDialogStatus] = useState("todo");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return tasks;
    const q = search.toLowerCase();
    return tasks.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.assignee_name?.toLowerCase().includes(q)
    );
  }, [tasks, search]);

  const tasksByStatus = useMemo(() => {
    const map: Record<string, typeof tasks> = {};
    for (const col of columns) map[col] = [];
    for (const task of filtered) {
      if (map[task.status]) map[task.status].push(task);
    }
    return map;
  }, [filtered]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    updateTask.mutate(
      { id: draggableId, status: destination.droppableId, position: destination.index },
      { onError: () => toast.error("Failed to move task") }
    );
  };

  const handleAddTask = (status: string) => {
    setDialogStatus(status);
    setDialogOpen(true);
  };

  const handleDeleteTask = (id: string) => {
    deleteTask.mutate(id, {
      onSuccess: () => toast.success("Task deleted"),
      onError: () => toast.error("Failed to delete task"),
    });
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="px-8 py-5 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Projects</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Manage and track your tasks</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 w-64 rounded-lg border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              />
            </div>
            <button
              onClick={() => handleAddTask("todo")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
            >
              <Plus className="w-4 h-4" />
              Add Task
            </button>
          </div>
        </div>
      </header>

      {/* Board */}
      <div className="flex-1 overflow-auto p-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-6">
              {columns.map((col) => (
                <KanbanColumn
                  key={col}
                  status={col}
                  tasks={tasksByStatus[col]}
                  onAddTask={handleAddTask}
                  onDeleteTask={handleDeleteTask}
                />
              ))}
            </div>
          </DragDropContext>
        )}
      </div>

      <AddTaskDialog open={dialogOpen} onOpenChange={setDialogOpen} defaultStatus={dialogStatus} />
    </div>
  );
}
