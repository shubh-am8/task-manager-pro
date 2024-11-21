"use client";

import { useTaskStore, type Task } from "@/lib/store";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Edit, Trash, Eye } from "lucide-react";
import { useState } from "react";
import TaskDialog from "./task-dialog";
import TaskViewDialog from "./task-view-dialog";
import { motion, AnimatePresence } from "framer-motion";

export default function TaskList() {
  const { tasks, deleteTask } = useTaskStore();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const handleView = (task: Task) => {
    setSelectedTask(task);
    setIsViewOpen(true);
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
            className="group relative overflow-hidden bg-card rounded-lg border shadow-sm hover:shadow-lg transition-all duration-200"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/10 pointer-events-none" />
            <div className="relative p-6">
              <div className="flex items-start gap-6">
                <div className="flex-1 min-w-0 space-y-4">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-semibold truncate">{task.title}</h3>
                    <Badge 
                      variant="outline"
                      className="bg-background/50 backdrop-blur-sm"
                    >
                      {task.status}
                    </Badge>
                    <Badge 
                      variant="secondary"
                      className="bg-background/50 backdrop-blur-sm"
                    >
                      {task.priority}
                    </Badge>
                  </div>
                  <div 
                    className="text-muted-foreground line-clamp-2 prose dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: task.description }}
                  />
                  <div className="flex items-center gap-6">
                    <div className="flex items-center text-muted-foreground text-sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      {format(new Date(task.dueDate), "PPP")}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {task.tags.map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="secondary" 
                          className="text-xs bg-background/50 backdrop-blur-sm"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleView(task);
                    }}
                    className="hover:bg-background/80 backdrop-blur-sm"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(task);
                    }}
                    className="hover:bg-background/80 backdrop-blur-sm"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTask(task.id);
                    }}
                    className="hover:bg-background/80 backdrop-blur-sm"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {selectedTask && (
        <>
          <TaskDialog
            task={selectedTask}
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
          />
          <TaskViewDialog
            task={selectedTask}
            open={isViewOpen}
            onOpenChange={setIsViewOpen}
          />
        </>
      )}

      {tasks.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 text-muted-foreground"
        >
          No tasks yet. Click &quot;Add Task&quot; to create one.
        </motion.div>
      )}
    </div>
  );
}