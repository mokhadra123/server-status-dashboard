import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { LuArrowLeft } from "react-icons/lu";

import ServerDetailInfo from "../_components/server-detail-info";
import ServerDetailsChart from "../_components/server-details-chart";
import ServerStatusTimeline from "../_components/server-status-timeline";

import { mockServers, getServerWithJitter } from "@/lib/mock-data/servers-data";

export const metadata: Metadata = {
  title: "Server Details",
  description: "Server details page",
};

export default async function ServerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const baseServer = mockServers.find((s) => s.id === id);
  if (!baseServer) notFound();

  const server = getServerWithJitter(baseServer);

  return (
    <>
      <div className="mb-4">
        <Link
          href="/servers"
          className="mb-1 inline-flex items-center gap-1.5 text-sm text-text-secondary transition hover:text-text-primary"
        >
          <LuArrowLeft size={16} aria-hidden />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">
          {server.name}
        </h1>
        <p className="text-sm text-text-secondary">
          Detailed server metrics and status history
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ServerDetailInfo server={server} />
        </div>
        <div className="flex flex-col gap-4 lg:col-span-2">
          <ServerDetailsChart server={server} />
          <ServerStatusTimeline server={server} />
        </div>
      </div>
    </>
  );
}
