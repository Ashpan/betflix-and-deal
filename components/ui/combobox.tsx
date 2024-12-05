"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface ComboboxItem {
  value: string;
  label: string;
}

interface ComboboxProps {
  items: ComboboxItem[];
  placeholder?: string;
  onSelect: (value: string) => void;
}

export function Combobox({
  items,
  placeholder = "Select an item...",
  onSelect,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [filteredItems, setFilteredItems] = React.useState(items);

  const handleSearch = React.useCallback(
    (search: string) => {
      const filtered = items.filter((item) =>
        item.label.toLowerCase().includes(search.toLowerCase()),
      );
      setFilteredItems(filtered);
    },
    [items],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? items.find((item) => item.value === value)?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={placeholder}
            onValueChange={handleSearch}
          />
          <CommandList>
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup>
              {filteredItems.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    onSelect(currentValue);
                    setOpen(false);
                  }}
                >
                  {item.label}
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
