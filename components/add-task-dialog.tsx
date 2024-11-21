"use client";

import TaskDialog from "./task-dialog";

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddTaskDialog({
  open,
  onOpenChange,
}: AddTaskDialogProps) {
  return <TaskDialog open={open} onOpenChange={onOpenChange} />;
}