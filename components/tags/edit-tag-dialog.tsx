"use client";

import { useTaskStore, type TagOrStatus } from "@/lib/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TagForm from "./tag-form";
import { toast } from "sonner";

interface EditTagDialogProps {
  tag: TagOrStatus;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditTagDialog({
  tag,
  open,
  onOpenChange,
}: EditTagDialogProps) {
  const { updateTag } = useTaskStore();

  const handleSubmit = (data: { name: string; color: string }) => {
    updateTag(tag.id, data);
    onOpenChange(false);
    toast.success("Tag updated successfully");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Tag</DialogTitle>
        </DialogHeader>
        <TagForm
          tag={tag}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}