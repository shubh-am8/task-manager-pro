"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useTaskStore, type Task, type Note } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { RichTextEditor } from "./rich-text-editor";
import { toast } from "sonner";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Edit2, Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface TaskViewDialogProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TaskViewDialog({
  task,
  open,
  onOpenChange,
}: TaskViewDialogProps) {
  const { tasks, addNote, updateNote, deleteNote } = useTaskStore();
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [currentTask, setCurrentTask] = useState<Task>(task);

  // Update currentTask when task changes or tasks array changes
  useEffect(() => {
    const updatedTask = tasks.find(t => t.id === task.id);
    if (updatedTask) {
      setCurrentTask(updatedTask);
    }
  }, [task.id, tasks]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setNoteTitle("");
      setNoteContent("");
      setEditingNoteId(null);
      setIsAddingNote(false);
    }
  }, [open]);

  const handleAddNote = () => {
    if (!noteTitle.trim() || !noteContent.trim()) {
      toast.error("Note title and content are required");
      return;
    }

    addNote(currentTask.id, { title: noteTitle, content: noteContent });
    setNoteTitle("");
    setNoteContent("");
    setIsAddingNote(false);
    toast.success("Note added successfully");
  };

  const handleUpdateNote = (noteId: string) => {
    if (!noteTitle.trim() || !noteContent.trim()) {
      toast.error("Note title and content are required");
      return;
    }

    updateNote(currentTask.id, noteId, { title: noteTitle, content: noteContent });
    setNoteTitle("");
    setNoteContent("");
    setEditingNoteId(null);
    toast.success("Note updated successfully");
  };

  const handleEditNote = (note: Note) => {
    setEditingNoteId(note.id);
    setNoteTitle(note.title);
    // Ensure we're setting both title and content
    setNoteContent(note.content || "");
  };

  const handleDeleteNote = (noteId: string) => {
    deleteNote(currentTask.id, noteId);
    toast.success("Note deleted successfully");
  };

  const handleCancelEdit = () => {
    setNoteTitle("");
    setNoteContent("");
    setEditingNoteId(null);
    setIsAddingNote(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[800px]"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl">{currentTask.title}</DialogTitle>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline">{currentTask.status}</Badge>
            <Badge variant="secondary">{currentTask.priority}</Badge>
            {currentTask.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </DialogHeader>

        <Tabs defaultValue="details" className="mt-4">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-4 space-y-4">
            <div className="prose dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: currentTask.description }} />
            </div>
            <div className="text-sm text-muted-foreground">
              Due: {format(new Date(currentTask.dueDate), "PPP")}
            </div>
          </TabsContent>

          <TabsContent value="notes" className="mt-4">
            <div className="space-y-4">
              <div className="flex justify-end">
                {!isAddingNote && !editingNoteId && (
                  <Button onClick={() => setIsAddingNote(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Note
                  </Button>
                )}
              </div>

              <AnimatePresence mode="popLayout">
                {(isAddingNote || editingNoteId) && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4 bg-card border rounded-lg p-4"
                  >
                    <Input
                      placeholder="Note title..."
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                      className="font-medium"
                    />
                    <RichTextEditor
                      content={noteContent}
                      onChange={setNoteContent}
                      placeholder="Note content..."
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={handleCancelEdit}>
                        Cancel
                      </Button>
                      <Button
                        onClick={() =>
                          editingNoteId
                            ? handleUpdateNote(editingNoteId)
                            : handleAddNote()
                        }
                      >
                        {editingNoteId ? "Update" : "Add"} Note
                      </Button>
                    </div>
                  </motion.div>
                )}

                {currentTask.notes?.map((note) => (
                  <motion.div
                    key={note.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={cn(
                      "border rounded-lg overflow-hidden transition-colors",
                      note.color
                    )}
                  >
                    <div className="bg-black/10 p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-white">{note.title}</h3>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditNote(note)}
                            className="text-white hover:text-white hover:bg-white/20"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteNote(note.id)}
                            className="text-white hover:text-white hover:bg-white/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-sm text-white/80">
                        {format(new Date(note.createdAt), "PPP 'at' pp")}
                      </div>
                      <div className="prose dark:prose-invert max-w-none text-white">
                        <div dangerouslySetInnerHTML={{ __html: note.content }} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {!isAddingNote && !editingNoteId && (!currentTask.notes || currentTask.notes.length === 0) && (
                <div className="text-center py-12 text-muted-foreground">
                  No notes yet. Click &quot;Add Note&quot; to create one.
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <div className="space-y-4">
              {currentTask.history.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-4 text-sm"
                >
                  <div className="min-w-[150px] text-muted-foreground">
                    {format(new Date(event.timestamp), "PPP 'at' pp")}
                  </div>
                  <div>
                    <div className="font-medium">{event.action}</div>
                    <div className="text-muted-foreground">{event.details}</div>
                    {event.previousValue && event.newValue && (
                      <div className="mt-1 text-xs">
                        <div className="text-red-500">- {event.previousValue}</div>
                        <div className="text-green-500">+ {event.newValue}</div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}