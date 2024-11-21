"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Write something...",
  readOnly = false,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editable: !readOnly,
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert max-w-none min-h-[100px] focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  if (readOnly) {
    return (
      <div className="prose dark:prose-invert max-w-none">
        <EditorContent editor={editor} />
      </div>
    );
  }

  return (
    <div className="border rounded-lg" onClick={(e) => e.stopPropagation()}>
      <div className="flex flex-wrap items-center gap-1 border-b p-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            editor.chain().focus().toggleBold().run();
          }}
          data-active={editor.isActive("bold")}
          className="data-[active=true]:bg-muted"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            editor.chain().focus().toggleItalic().run();
          }}
          data-active={editor.isActive("italic")}
          className="data-[active=true]:bg-muted"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            editor.chain().focus().toggleUnderline().run();
          }}
          data-active={editor.isActive("underline")}
          className="data-[active=true]:bg-muted"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const url = window.prompt("Enter URL");
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          data-active={editor.isActive("link")}
          className="data-[active=true]:bg-muted"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            editor.chain().focus().toggleBulletList().run();
          }}
          data-active={editor.isActive("bulletList")}
          className="data-[active=true]:bg-muted"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            editor.chain().focus().toggleOrderedList().run();
          }}
          data-active={editor.isActive("orderedList")}
          className="data-[active=true]:bg-muted"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            editor.chain().focus().toggleBlockquote().run();
          }}
          data-active={editor.isActive("blockquote")}
          className="data-[active=true]:bg-muted"
        >
          <Quote className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}