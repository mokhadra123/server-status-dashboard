"use client";

import { useEffect, useState } from "react";
import { Server, ServerStatus } from "@/types";
import {
  generateTimelineSegments,
  getStatusColor,
  getStatusLabel,
} from "../_lib/server.helpers";

interface ServerStatusTimelineProps {
  server: Server;
}

type Segment = ReturnType<typeof generateTimelineSegments>[number];

export default function ServerStatusTimeline({ server }: ServerStatusTimelineProps) {
  const [segments, setSegments] = useState<Segment[]>([]);

  useEffect(() => {
    setSegments(generateTimelineSegments(server));
  }, [server]);

  return (
    <div className="rounded-xl border border-border-default bg-surface-raised p-5">
      <h3 className="mb-4 text-sm font-bold text-text-primary">
        Status Timeline (Last 24 Hours)
      </h3>

      <div className="flex h-8 gap-0.5 overflow-hidden rounded-md bg-surface-sunken">
        {segments.map((seg, i) => (
          <div
            key={i}
            title={`${24 - i}h ago - ${getStatusLabel(seg.status)}`}
            className="flex-1 opacity-85 transition-opacity hover:opacity-100"
            style={{
              backgroundColor: getStatusColor(seg.status),
              borderTopLeftRadius: i === 0 ? 6 : 0,
              borderBottomLeftRadius: i === 0 ? 6 : 0,
              borderTopRightRadius: i === 23 ? 6 : 0,
              borderBottomRightRadius: i === 23 ? 6 : 0,
            }}
          />
        ))}
      </div>

      <div className="mt-1.5 flex justify-between">
        <span className="text-xs text-text-secondary">24h ago</span>
        <span className="text-xs text-text-secondary">Now</span>
      </div>

      <div className="mt-2 flex items-center gap-4">
        {(["up", "degraded", "down"] as ServerStatus[]).map((status) => (
          <div key={status} className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: getStatusColor(status) }}
            />
            <span className="text-xs text-text-secondary">
              {getStatusLabel(status)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
