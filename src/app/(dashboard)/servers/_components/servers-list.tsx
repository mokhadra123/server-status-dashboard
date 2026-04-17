"use client";

import { useMemo, useState } from "react";
import { mockServers } from "@/lib/mock-data/servers-data";
import { useDebounce } from "@/hooks/use-debounce";
import type { Server, SortDirection, SortField, StatusFilter } from "@/types";
import ServerCard from "./server-card";
import ServerStatsCards from "./server-stats-cards";
import ServerFilters from "./server-filters";

const STATUS_PRIORITY: Record<Server["status"], number> = {
  down: 0,
  degraded: 1,
  up: 2,
};

export default function ServersList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const debouncedSearch = useDebounce(search, 300);

  const visibleServers = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    const dir = sortDirection === "asc" ? 1 : -1;

    return mockServers
      .filter((s) => statusFilter === "all" || s.status === statusFilter)
      .filter((s) => {
        if (!query) return true;
        return (
          s.name.toLowerCase().includes(query) ||
          s.ipAddress.toLowerCase().includes(query)
        );
      })
      .slice()
      .sort((a, b) => {
        switch (sortField) {
          case "name":
            return a.name.localeCompare(b.name) * dir;
          case "status":
            return (
              (STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status]) * dir
            );
          case "responseTime":
            return (a.responseTime - b.responseTime) * dir;
          case "uptime":
            return (a.uptime - b.uptime) * dir;
          default:
            return 0;
        }
      });
  }, [debouncedSearch, statusFilter, sortField, sortDirection]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-text-primary">Servers</h2>
        <p className="text-sm text-text-secondary">
          Monitor status, response time, and uptime across your fleet.
        </p>
      </div>

      <ServerStatsCards servers={mockServers} />

      <ServerFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortField={sortField}
        onSortFieldChange={setSortField}
        sortDirection={sortDirection}
        onSortDirectionToggle={() =>
          setSortDirection((d) => (d === "asc" ? "desc" : "asc"))
        }
        resultCount={visibleServers.length}
      />

      {visibleServers.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border-default bg-surface-raised p-10 text-center text-sm text-text-secondary">
          No servers match your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visibleServers.map((server, i) => (
            <ServerCard key={server.id} server={server} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
