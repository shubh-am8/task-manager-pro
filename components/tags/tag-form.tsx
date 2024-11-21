"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTaskStore, type TagOrStatus } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ColorPicker } from "./color-picker";

const tagSchema = z.object({
  name: z
    .string()
    .min(2, "Tag name must be at least 2 characters")
    .max(20, "Tag name must not exceed 20 characters")
    .regex(/^[a-zA-Z0-9-]+$/, "Only letters, numbers, and hyphens are allowed"),
  color: z.string(),
});

type TagFormValues = z.infer<typeof tagSchema>;

interface TagFormProps {
  tag?: TagOrStatus;
  onSubmit: (data: TagFormValues) => void;
  onCancel: () => void;
}

export default function TagForm({ tag, onSubmit, onCancel }: TagFormProps) {
  const { tags } = useTaskStore();

  const form = useForm<TagFormValues>({
    resolver: zodResolver(
      tagSchema.refine(
        (data) => {
          const existingTag = tags.find(
            (t) => t.name === data.name && t.id !== tag?.id
          );
          return !existingTag;
        },
        {
          message: "A tag with this name already exists",
          path: ["name"],
        }
      )
    ),
    defaultValues: {
      name: tag?.name || "",
      color: tag?.color || "bg-blue-500",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter tag name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <FormControl>
                <ColorPicker value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{tag ? "Update" : "Create"}</Button>
        </div>
      </form>
    </Form>
  );
}