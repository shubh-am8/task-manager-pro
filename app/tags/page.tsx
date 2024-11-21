"use client";

import { useState } from "react";
import { useTaskStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Grid, List, Plus, Search } from "lucide-react";
import TagList from "@/components/tags/tag-list";
import TagGrid from "@/components/tags/tag-grid";
import AddTagDialog from "@/components/tags/add-tag-dialog";

export default function TagsPage() {
  const [isAddTagOpen, setIsAddTagOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold">Tag Management</h1>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex items-center gap-2 border rounded-lg p-1">
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={() => setIsAddTagOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Tag
            </Button>
          </div>
        </div>

        {viewMode === "list" ? (
          <TagList searchQuery={searchQuery} />
        ) : (
          <TagGrid searchQuery={searchQuery} />
        )}

        <AddTagDialog open={isAddTagOpen} onOpenChange={setIsAddTagOpen} />
      </div>
    </main>
  );
}