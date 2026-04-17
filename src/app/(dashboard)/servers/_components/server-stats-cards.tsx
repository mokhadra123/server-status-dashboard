import { LuServer, LuCircleCheck, LuTriangleAlert, LuCircleX } from "react-icons/lu";
import type { Server, ServerStatus } from "@/types";
import { getStatusColor } from "../_lib/server.helpers";

interface ServerStatsCardsProps {
  servers: Server[];
}

const STAT_ITEMS: {
  key: "total" | ServerStatus;
  label: string;
  icon: React.ComponentType<{ size?: number; "aria-hidden"?: boolean }>;
}[] = [
  { key: "total", label: "Total Servers", icon: LuServer },
  { key: "up", label: "Operational", icon: LuCircleCheck },
  { key: "degraded", label: "Degraded", icon: LuTriangleAlert },
  { key: "down", label: "Down", icon: LuCircleX },
];

export default function ServerStatsCards({ servers }: ServerStatsCardsProps) {
  const counts = {
    total: servers.length,
    up: servers.filter((s) => s.status === "up").length,
    degraded: servers.filter((s) => s.status === "degraded").length,
    down: servers.filter((s) => s.status === "down").length,
  };

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {STAT_ITEMS.map(({ key, label, icon: Icon }) => {
        const color = key === "total" ? "#3b82f6" : getStatusColor(key);
        return (
          <div
            key={key}
            className="flex items-center gap-3 rounded-xl border border-border-default bg-surface-raised p-4"
          >
            <span
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${color}18`, color }}
            >
              <Icon size={18} aria-hidden />
            </span>
            <div className="flex flex-col">
              <span className="text-xs text-text-secondary">{label}</span>
              <span className="text-xl font-bold text-text-primary">
                {counts[key]}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
