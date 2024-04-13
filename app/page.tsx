"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Home() {
  const SORT_OPTIONS = [
    { name: "None", value: "none" },
    { name: "Price", value: "asc" },
    { name: "Price", value: "desc" },
  ] as const;
  // declaring it "as conts" will make it a constant and also prevent pushing into the array, like SORT_OPTIONS.PUSH({name: "new", value: "value"}

  // state management for sorting
  const [filter, setFilter] = useState({
    sort: "none",
  });

  console.log(filter);

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
      <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          High-quality cotton selection
        </h1>

        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger className="group inline-flex text-sm font-medium text-gray-700 hover:text-gray-900">
              Sort
              <ChevronDown className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {SORT_OPTIONS.map((option) => (
                <DropdownMenuItem key={option.value}>
                  <button
                    className={cn("w-full px-4 py-2 text-left text-sm", {
                      "bg-gray-100 text-gray-900": option.value === filter.sort,
                      "text-gray-500": option.value !== filter.sort,
                    })}
                    onClick={() =>
                      setFilter((prev) => ({
                        ...prev,
                        sort: option.value,
                      }))
                    }
                  >
                    {option.name}: {option.value}
                  </button>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </main>
  );
}
