"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useTaskStore, type Task } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CreatableSelect } from "./creatable-select";
import { RichTextEditor } from "./rich-text-editor";
import { toast } from "sonner";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  dueDate: z.date(),
  tags: z.array(z.string()),
  status: z.string(),
  priority: z.enum(["low", "medium", "high", "critical"]),
  reminder: z.date().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskDialogProps {
  task?: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TaskDialog({
  task,
  open,
  onOpenChange,
}: TaskDialogProps) {
  const { addTask, updateTask, tags, statuses, addTag, addStatus } = useTaskStore();

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: new Date(),
      tags: [],
      status: "todo",
      priority: "medium",
    },
  });

  useEffect(() => {
    if (task) {
      form.reset({
        title: task.title,
        description: task.description,
        dueDate: new Date(task.dueDate),
        tags: task.tags,
        status: task.status,
        priority: task.priority,
        reminder: task.reminder ? new Date(task.reminder) : undefined,
      });
    }
  }, [task, form]);

  const onSubmit = async (data: TaskFormValues) => {
    try {
      if (task) {
        updateTask(task.id, data);
        toast.success("Task updated successfully");
      } else {
        addTask(data);
        toast.success("Task created successfully");
      }
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast.error("An error occurred while saving the task");
      console.error("Task save error:", error);
    }
  };

  const priorities = [
    { id: "low", name: "low", color: "bg-green-500" },
    { id: "medium", name: "medium", color: "bg-yellow-500" },
    { id: "high", name: "high", color: "bg-orange-500" },
    { id: "critical", name: "critical", color: "bg-red-500" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[800px]"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Add Task"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Task title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      content={field.value}
                      onChange={field.onChange}
                      placeholder="Task description..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <CreatableSelect
                      value={field.value}
                      onChange={(newValue) => field.onChange(newValue)}
                      options={tags}
                      onCreateOption={addTag}
                      placeholder="Select or create tags"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <CreatableSelect
                      value={field.value}
                      onChange={(newValue) => {
                        if (typeof newValue === 'string') {
                          field.onChange(newValue);
                        }
                      }}
                      options={statuses}
                      onCreateOption={addStatus}
                      placeholder="Select or create status"
                      isMulti={false}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <FormControl>
                    <CreatableSelect
                      value={field.value}
                      onChange={(newValue) => {
                        if (typeof newValue === 'string') {
                          field.onChange(newValue);
                        }
                      }}
                      options={priorities}
                      onCreateOption={() => {}}
                      placeholder="Select priority"
                      isMulti={false}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  onOpenChange(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">{task ? "Update" : "Create"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}