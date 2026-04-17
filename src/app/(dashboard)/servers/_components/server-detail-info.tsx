"use client";

import { useEffect, useState } from "react";
import { LuCopy } from "react-icons/lu";

import {
  formatResponseTime,
  formatUptime,
  getRelativeTime,
  getStatusColor,
  getStatusLabel,
} from "../_lib/server.helpers";
import { Server } from "@/types";

interface ServerDetailInfoProps {
  server: Server;
}

export default function ServerDetailInfo({ server }: ServerDetailInfoProps) {
  const [copied, setCopied] = useState(false);
  const [lastChecked, setLastChecked] = useState("");
  const statusColor = getStatusColor(server.status);

  // Auto-hide the "copied" toast after 2s (replaces MUI Snackbar autoHideDuration)
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  useEffect(() => {
    setLastChecked(getRelativeTime(server.lastChecked));
  }, [server.lastChecked]);

  const copyIp = async () => {
    await navigator.clipboard.writeText(server.ipAddress);
    setCopied(true);
  };

  const items: { label: string; value: React.ReactNode }[] = [
    {
      label: "Status",
      value: (
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold"
          style={{
            backgroundColor: `${statusColor}18`, // ~9% alpha
            color: statusColor,
          }}
        >
          <span
            className="inline-block h-1.5 w-1.5 animate-pulse rounded-full"
            style={{ backgroundColor: statusColor }}
          />
          {getStatusLabel(server.status)}
        </span>
      ),
    },
    {
      label: "IP Address",
      value: (
        <span className="flex items-center gap-1">
          <span className="font-mono text-sm text-text-primary">
            {server.ipAddress}
          </span>
          <button
            type="button"
            onClick={copyIp}
            title="Copy IP"
            aria-label="Copy IP address"
            className="rounded p-1 text-text-muted transition hover:bg-surface-overlay hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/30"
          >
            <LuCopy size={14} aria-hidden />
          </button>
        </span>
      ),
    },
    { label: "Response Time", value: formatResponseTime(server.responseTime) },
    { label: "Uptime", value: formatUptime(server.uptime) },
    { label: "Location", value: server.location },
    { label: "Last Checked", value: lastChecked },
  ];

  return (
    <>
      <div className="rounded-xl border border-border-default bg-surface-raised">
        <div className="p-5">
          <h3 className="text-sm font-bold text-text-primary">
            Server Information
          </h3>
        </div>

        <dl className="divide-y divide-border-default border-t border-border-default">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between gap-4 px-5 py-3"
            >
              <dt className="text-xs text-text-secondary">{item.label}</dt>
              <dd
                className={
                  typeof item.value === "string"
                    ? "text-sm font-semibold text-text-primary"
                    : ""
                }
              >
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {copied && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-md bg-surface-overlay px-4 py-2 text-sm text-text-primary shadow-lg"
        >
          IP address copied
        </div>
      )}
    </>
  );
}
