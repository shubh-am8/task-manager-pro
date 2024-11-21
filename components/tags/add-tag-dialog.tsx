"use client";

import { useTaskStore } from "@/lib/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TagForm from "./tag-form";
import { toast } from "sonner";

interface AddTagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddTagDialog({
  open,
  onOpenChange,
}: AddTagDialogProps) {
  const { addTag } = useTaskStore();

  const handleSubmit = (data: { name: string; color: string }) => {
    addTag(data.name, data.color);
    onOpenChange(false);
    toast.success("Tag created successfully");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Tag</DialogTitle>
        </DialogHeader>
        <TagForm
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}