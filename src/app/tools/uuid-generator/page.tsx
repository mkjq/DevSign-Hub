import { UuidGeneratorTool } from "@/components/tools/UuidGeneratorTool";

export const metadata = {
  title: "UUID/GUID v4 Generator | DevSign Hub",
  description: "Generate unique secure UUIDs in bulk.",
};

export default function Page() {
  return <UuidGeneratorTool />;
}
