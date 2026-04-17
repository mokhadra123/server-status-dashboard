"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { getStatusColor } from "../_lib/server.helpers";
import type { Server } from "@/types";

interface ServerDetailChartProps {
  server: Server;
}

export default function ServerDetailsChart({ server }: ServerDetailChartProps) {
  const statusColor = getStatusColor(server.status);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const chartData = useMemo(
    () =>
      server.responseHistory.map((val, i) => ({
        hour: `${24 - i}h`,
        responseTime: val,
      })),
    [server.responseHistory],
  );

  return (
    <div className="rounded-xl border border-border-default bg-surface-raised p-5">
      <h3 className="mb-4 text-sm font-bold text-text-primary">
        Response Time (Last 24 Hours)
      </h3>
      <div className="h-[280px]">
        {mounted && (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={statusColor} stopOpacity={0.25} />
                <stop offset="100%" stopColor={statusColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(128,128,128,0.15)"
            />
            <XAxis
              dataKey="hour"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}ms`}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: "1px solid rgba(128,128,128,0.2)",
                fontSize: 13,
              }}
              formatter={(value) => [`${value}ms`, "Response Time"]}
            />
            <Area
              type="monotone"
              dataKey="responseTime"
              stroke={statusColor}
              strokeWidth={2}
              fill="url(#chartGradient)"
              dot={false}
              activeDot={{ r: 4, fill: statusColor }}
            />
          </AreaChart>
        </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
