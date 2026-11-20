"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type HistoryStatusFilter = "all" | "completed" | "active";

interface HistoryFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: HistoryStatusFilter;
  onStatusFilterChange: (filter: HistoryStatusFilter) => void;
  totalCount: number;
  filteredCount: number;
}

const FILTER_OPTIONS: ReadonlyArray<{
  value: HistoryStatusFilter;
  label: string;
}> = [
  { value: "all", label: "All" },
  { value: "completed", label: "Completed" },
  { value: "active", label: "In Progress / Failed" },
];

export function HistoryFilterBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  totalCount,
  filteredCount,
}: HistoryFilterBarProps) {
  if (totalCount === 0) return null;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1 sm:max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by file name or target role..."
          aria-label="Search scan history"
          className="pr-8 pl-9"
        />
        {searchQuery && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Clear search"
            onClick={() => onSearchChange("")}
            className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {FILTER_OPTIONS.map((opt) => {
          const active = statusFilter === opt.value;
          return (
            <Button
              key={opt.value}
              type="button"
              size="sm"
              variant={active ? "secondary" : "ghost"}
              onClick={() => onStatusFilterChange(opt.value)}
              className="h-8 text-xs"
            >
              {opt.label}
            </Button>
          );
        })}
        <span className="ml-1 text-xs text-muted-foreground">
          {filteredCount} {filteredCount === 1 ? "resume" : "resumes"}
        </span>
      </div>
    </div>
  );
}