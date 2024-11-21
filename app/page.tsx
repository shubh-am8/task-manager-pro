"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTaskStore } from "@/lib/store";
import { Plus, List, Grid, Tags } from "lucide-react";
import TaskList from "@/components/task-list";
import TaskGrid from "@/components/task-grid";
import AddTaskDialog from "@/components/add-task-dialog";

export default function Home() {
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const { viewMode, setViewMode } = useTaskStore();

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold">Task Manager</h1>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/tags">
              <Button variant="outline" size="icon">
                <Tags className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-2 border rounded-lg p-1">
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "cards" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("cards")}
              >
                <Grid className="h-4 w-4" />
              </Button>
            </div>
            <ThemeToggle />
            <Button onClick={() => setIsAddTaskOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Task
            </Button>
          </div>
        </div>

        {viewMode === "list" ? <TaskList /> : <TaskGrid />}

        <AddTaskDialog
          open={isAddTaskOpen}
          onOpenChange={setIsAddTaskOpen}
        />
      </div>
    </main>
  );
}