import DashboardShell from "@/components/layout/dashboard-shell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black">
      <DashboardShell>{children}</DashboardShell>
    </div>
  );
}
