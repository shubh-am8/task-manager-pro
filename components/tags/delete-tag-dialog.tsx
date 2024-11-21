"use client";

import { useTaskStore, type TagOrStatus } from "@/lib/store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface DeleteTagDialogProps {
  tag: TagOrStatus;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteTagDialog({
  tag,
  open,
  onOpenChange,
}: DeleteTagDialogProps) {
  const { deleteTag } = useTaskStore();

  const handleDelete = () => {
    deleteTag(tag.id);
    onOpenChange(false);
    toast.success("Tag deleted successfully");
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Tag</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the tag "{tag.name}"? This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}