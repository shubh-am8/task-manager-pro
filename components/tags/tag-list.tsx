"use client";

import { useTaskStore, type TagOrStatus } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import EditTagDialog from "./edit-tag-dialog";
import DeleteTagDialog from "./delete-tag-dialog";

interface TagListProps {
  searchQuery: string;
}

export default function TagList({ searchQuery }: TagListProps) {
  const { tags } = useTaskStore();
  const [selectedTag, setSelectedTag] = useState<TagOrStatus | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (tag: TagOrStatus) => {
    setSelectedTag(tag);
    setIsEditOpen(true);
  };

  const handleDelete = (tag: TagOrStatus) => {
    setSelectedTag(tag);
    setIsDeleteOpen(true);
  };

  return (
    <div className="space-y-4">
      {filteredTags.map((tag) => (
        <div
          key={tag.id}
          className="flex items-center justify-between p-4 bg-card rounded-lg border"
        >
          <div className="flex items-center gap-4">
            <div className={`w-4 h-4 rounded-full ${tag.color}`} />
            <span className="font-medium">{tag.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(tag)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(tag)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}

      {selectedTag && (
        <>
          <EditTagDialog
            tag={selectedTag}
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
          />
          <DeleteTagDialog
            tag={selectedTag}
            open={isDeleteOpen}
            onOpenChange={setIsDeleteOpen}
          />
        </>
      )}

      {filteredTags.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          {searchQuery
            ? "No tags found matching your search."
            : "No tags yet. Click 'Add Tag' to create one."}
        </div>
      )}
    </div>
  );
}