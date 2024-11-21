"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
}

const COLORS = [
  "bg-rose-500",
  "bg-pink-500",
  "bg-fuchsia-500",
  "bg-purple-500",
  "bg-violet-500",
  "bg-indigo-500",
  "bg-blue-500",
  "bg-sky-500",
  "bg-cyan-500",
  "bg-teal-500",
  "bg-emerald-500",
  "bg-green-500",
  "bg-lime-500",
  "bg-yellow-500",
  "bg-amber-500",
  "bg-orange-500",
  "bg-red-500",
  "bg-slate-500",
];

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {COLORS.map((color) => (
        <button
          key={color}
          type="button"
          className={cn(
            color,
            "h-8 w-8 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            value === color && "ring-2 ring-ring ring-offset-2"
          )}
          onClick={() => onChange(color)}
        >
          {value === color && (
            <Check className="h-4 w-4 text-white mx-auto" />
          )}
        </button>
      ))}
    </div>
  );
}