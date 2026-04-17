"use client";

import { LuCircleAlert } from "react-icons/lu";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <LuCircleAlert size={56} className="mb-4 text-accent-error" aria-hidden />
      <h2 className="mb-2 text-2xl font-bold text-text-primary">
        Something went wrong
      </h2>
      <p className="mb-6 max-w-sm text-center text-sm text-text-secondary">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-md bg-accent-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent-primary/30"
      >
        Try again
      </button>
    </div>
  );
}
