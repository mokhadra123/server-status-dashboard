"use client";

import { useMemo, useRef, useState } from "react";
import { FiLogOut, FiUser } from "react-icons/fi";

import { useAuth } from "@/context/auth-context";
import { useOutsideClick } from "@/hooks/use-outside-click";

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase() || "?";
}

export default function AccountMenu() {
  const { user, isLoading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useOutsideClick(menuRef, () => setMenuOpen(false), menuOpen);

  const initials = useMemo(
    () => (user?.name ? getInitials(user.name) : "?"),
    [user?.name],
  );

  if (isLoading) {
    return (
      <div
        aria-hidden
        className="h-10 w-10 animate-pulse rounded-full bg-action-hover"
      />
    );
  }

  const handleLogout = async () => {
    setMenuOpen(false);
    setLoggingOut(true);
    try {
      await logout();
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="relative ml-1" ref={menuRef}>
      <button
        type="button"
        onClick={() => setMenuOpen((v) => !v)}
        title="Account"
        aria-label="Account menu"
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-action-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
          {initials}
        </span>
      </button>

      {menuOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 min-w-[220px] origin-top-right rounded-lg border border-divider bg-paper py-1 shadow-lg animate-grow-in"
        >
          <div className="px-4 py-2">
            <p className="truncate text-sm font-semibold text-text-primary">
              {user?.name}
            </p>
            <p className="truncate text-xs text-text-secondary">{user?.email}</p>
          </div>

          <div className="my-1 h-px bg-divider" />

          <button
            type="button"
            role="menuitem"
            disabled
            className="flex w-full items-center gap-3 px-4 py-2 text-sm text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiUser size={16} className="text-text-secondary" />
            Profile
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-3 px-4 py-2 text-sm text-text-primary transition-colors hover:bg-action-hover focus:bg-action-hover focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiLogOut size={16} className="text-text-secondary" />
            {loggingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      )}
    </div>
  );
}
