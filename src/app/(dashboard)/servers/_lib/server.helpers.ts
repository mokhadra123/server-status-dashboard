import { Server, ServerStatus } from "@/types";

export function getStatusColor(status: ServerStatus) {
  const colors: Record<ServerStatus, string> = {
    up: "#22c55e",
    degraded: "#f59e0b",
    down: "#ef4444",
  };
  return colors[status];
}

export function getStatusLabel(status: ServerStatus) {
  const labels: Record<ServerStatus, string> = {
    up: "Operational",
    degraded: "Degraded",
    down: "Down",
  };
  return labels[status];
}

export function formatUptime(uptime: number) {
  return `${uptime.toFixed(2)}%`;
}

export function formatResponseTime(ms: number) {
  return `${ms}ms`;
}

export function getRelativeTime(isoDate: string) {
  const now = Date.now();
  const then = new Date(isoDate).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60_000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.floor(diffHr / 24)}d ago`;
}

export function generateTimelineSegments(server: Server) {
  const statuses: ServerStatus[] = ['up', 'degraded', 'down'];
  const segments: { status: ServerStatus; hours: number }[] = [];

  for (let i = 0; i < 24; i++) {
    if (server.status === 'up') {
      segments.push({ status: Math.random() > 0.05 ? 'up' : 'degraded', hours: 1 });
    } else if (server.status === 'degraded') {
      const rand = Math.random();
      segments.push({
        status: rand > 0.6 ? 'up' : rand > 0.15 ? 'degraded' : 'down',
        hours: 1,
      });
    } else {
      const rand = Math.random();
      segments.push({
        status: rand > 0.7 ? 'degraded' : statuses[Math.random() > 0.4 ? 2 : 0],
        hours: 1,
      });
    }
  }

  return segments;
}