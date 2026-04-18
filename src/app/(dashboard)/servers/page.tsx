import { Metadata } from "next";
import ServersList from "./_components/servers-list";

export const metadata: Metadata = {
  title: "Servers",
  description: "Servers page",
};

export default function ServersPage() {
  return <ServersList />;
};
