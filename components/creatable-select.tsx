"use client";

import { useState } from "react";
import { Command } from "cmdk";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TagOrStatus } from "@/lib/store";

interface CreatableSelectProps {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  options: TagOrStatus[];
  onCreateOption: (value: string) => void;
  placeholder?: string;
  isMulti?: boolean;
}

export function CreatableSelect({
  value,
  onChange,
  options,
  onCreateOption,
  placeholder = "Select...",
  isMulti = true,
}: CreatableSelectProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleSelect = (currentValue: string) => {
    if (isMulti) {
      const values = Array.isArray(value) ? value : [];
      const newValue = values.includes(currentValue)
        ? values.filter((v) => v !== currentValue)
        : [...values, currentValue];
      onChange(newValue);
    } else {
      onChange(currentValue);
      setOpen(false);
    }
    setInputValue("");
  };

  const createOption = () => {
    if (inputValue) {
      onCreateOption(inputValue);
      handleSelect(inputValue);
    }
  };

  const optionNames = options.map(opt => opt.name);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {isMulti ? (
            <div className="flex flex-wrap gap-1">
              {Array.isArray(value) && value.length > 0 ? (
                value.map((v) => (
                  <Badge
                    variant="secondary"
                    key={v}
                    className="mr-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(v);
                    }}
                  >
                    {v}
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
          ) : (
            <span className={cn(!value && "text-muted-foreground")}>
              {value || placeholder}
            </span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <div className="flex items-center border-b px-3">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search or create..."
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="max-h-[300px] overflow-auto p-1">
            {optionNames.map((optionName) => (
              <div
                key={optionName}
                onClick={() => handleSelect(optionName)}
                className={cn(
                  "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                  {
                    "bg-accent text-accent-foreground":
                      isMulti
                        ? Array.isArray(value) && value.includes(optionName)
                        : value === optionName,
                  }
                )}
              >
                {optionName}
                {isMulti ? (
                  Array.isArray(value) &&
                  value.includes(optionName) && (
                    <Check className="ml-auto h-4 w-4" />
                  )
                ) : (
                  value === optionName && <Check className="ml-auto h-4 w-4" />
                )}
              </div>
            ))}
            {inputValue && !optionNames.includes(inputValue) && (
              <div
                onClick={createOption}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create &quot;{inputValue}&quot;
              </div>
            )}
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
}