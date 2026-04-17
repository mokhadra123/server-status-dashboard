"use client";

import {
  LuArrowDownNarrowWide,
  LuArrowUpNarrowWide,
  LuChevronDown,
} from "react-icons/lu";
import { SearchInput } from "@/components/ui/search-input";
import type { SortDirection, SortField, StatusFilter } from "@/types";
import { getStatusColor, getStatusLabel } from "../_lib/server.helpers";

interface ServerFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (value: StatusFilter) => void;
  sortField: SortField;
  onSortFieldChange: (value: SortField) => void;
  sortDirection: SortDirection;
  onSortDirectionToggle: () => void;
  resultCount: number;
}

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "up", label: "Operational" },
  { value: "degraded", label: "Degraded" },
  { value: "down", label: "Down" },
];

const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: "name", label: "Name" },
  { value: "status", label: "Status" },
  { value: "responseTime", label: "Response time" },
  { value: "uptime", label: "Uptime" },
];

export default function ServerFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortField,
  onSortFieldChange,
  sortDirection,
  onSortDirectionToggle,
  resultCount,
}: ServerFiltersProps) {
  const activeSort =
    SORT_OPTIONS.find((o) => o.value === sortField)?.label ?? "Name";

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-divider bg-paper p-4 shadow-sm">
      {/* Row 1: search + sort */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="flex-1">
          <SearchInput
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            onClear={() => onSearchChange("")}
            placeholder="Search by name or IP…"
            aria-label="Search servers"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              aria-label="Sort by"
              value={sortField}
              onChange={(e) => onSortFieldChange(e.target.value as SortField)}
              className="h-10 appearance-none rounded-lg border border-divider bg-background pl-3 pr-9 text-sm font-medium text-text-primary outline-none transition hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  Sort by: {opt.label}
                </option>
              ))}
            </select>
            <LuChevronDown
              size={14}
              aria-hidden
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"
            />
          </div>

          <button
            type="button"
            onClick={onSortDirectionToggle}
            aria-label={
              sortDirection === "asc" ? "Sort descending" : "Sort ascending"
            }
            title={`${activeSort} • ${sortDirection === "asc" ? "Ascending" : "Descending"}`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-divider bg-background text-text-primary transition hover:border-primary/40 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {sortDirection === "asc" ? (
              <LuArrowUpNarrowWide size={16} aria-hidden />
            ) : (
              <LuArrowDownNarrowWide size={16} aria-hidden />
            )}
          </button>
        </div>
      </div>

      {/* Row 2: segmented status filter + result count */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Filter by status"
          className="inline-flex items-center gap-1 rounded-full border border-divider bg-background p-1"
        >
          {STATUS_OPTIONS.map((opt) => {
            const selected = statusFilter === opt.value;
            const dotColor =
              opt.value === "all" ? null : getStatusColor(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => onStatusFilterChange(opt.value)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
                  selected
                    ? "bg-paper text-text-primary shadow-sm ring-1 ring-divider"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {dotColor && (
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: dotColor }}
                    aria-hidden
                  />
                )}
                {opt.value === "all" ? opt.label : getStatusLabel(opt.value)}
              </button>
            );
          })}
        </div>

        <span className="text-xs text-text-secondary">
          {resultCount} {resultCount === 1 ? "server" : "servers"}
        </span>
      </div>
    </div>
  );
}
