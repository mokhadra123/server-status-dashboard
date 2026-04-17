"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

import {
  formatUptime,
  formatResponseTime,
  getRelativeTime,
  getStatusColor,
  getStatusLabel,
} from "../_lib/server.helpers";
import type { Server } from "@/types";

interface ServerCardProps {
  server: Server;
  index: number;
}

export default function ServerCard({ server, index }: ServerCardProps) {
  const router = useRouter();
  const statusColor = getStatusColor(server.status);
  const [lastChecked, setLastChecked] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const chartData = useMemo(
    () => server.responseHistory.map((val, i) => ({ i, v: val })),
    [server.responseHistory],
  );

  useEffect(() => {
    // it's safe to use server.lastChecked here because it's a static value
    setLastChecked(getRelativeTime(server.lastChecked));
  }, [server.lastChecked]);

  return (
    <div
      className="animate-grow-in cursor-pointer"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <button
        type="button"
        onClick={() => router.push(`/servers/${server.id}`)}
        className="group block w-full text-left rounded-card border border-divider bg-paper p-5 transition-[border-color,box-shadow] duration-200 hover:border-primary hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-base font-bold leading-tight text-text-primary">
              {server.name}
            </p>
            <p className="text-xs font-mono text-text-secondary">
              {server.ipAddress}
            </p>
          </div>

          <span
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-0.5 text-xs font-semibold"
            style={{ backgroundColor: `${statusColor}18`, color: statusColor }}
          >
            <span
              className="animate-pulse-dot inline-block h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: statusColor }}
            />
            {getStatusLabel(server.status)}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-xs text-text-secondary">Response</p>
            <p className="text-sm font-semibold text-text-primary">
              {formatResponseTime(server.responseTime)}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Uptime</p>
            <p className="text-sm font-semibold text-text-primary">
              {formatUptime(server.uptime)}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Location</p>
            <p className="text-sm font-semibold text-text-primary">
              {server.location}
            </p>
          </div>
        </div>

        {/* Sparkline */}
        <div className="h-10 mt-1">
          {mounted && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient
                    id={`grad-${server.id}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={statusColor} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={statusColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke={statusColor}
                  strokeWidth={1.5}
                  fill={`url(#grad-${server.id})`}
                  dot={false}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-text-secondary">{server.location}</p>
          <p className="text-xs text-text-secondary" suppressHydrationWarning>
            {lastChecked}
          </p>
        </div>

        {/* Progress */}
        <div className="mt-3 h-[3px] w-full overflow-hidden rounded bg-action-hover">
          <div
            className="h-full rounded transition-[width] duration-300"
            style={{
              width: `${Math.min(100, Math.max(0, server.uptime))}%`,
              backgroundColor: statusColor,
            }}
          />
        </div>
      </button>
    </div>
  );
}
