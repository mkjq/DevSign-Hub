import { DnsLookupTool } from "@/components/tools/DnsLookupTool";

export const metadata = {
  title: "DNS & WHOIS Lookup | DevSign Hub",
  description: "Fetch public DNS records.",
};

export default function Page() {
  return <DnsLookupTool />;
}
