import { HashGeneratorTool } from "@/components/tools/HashGeneratorTool";

export const metadata = {
  title: "Cryptographic Hash Generator | DevSign Hub",
  description: "Compute secure message digests using MD5, SHA.",
};

export default function Page() {
  return <HashGeneratorTool />;
}
