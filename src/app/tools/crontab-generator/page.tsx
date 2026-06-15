import { CrontabGeneratorTool } from "@/components/tools/CrontabGeneratorTool";

export const metadata = {
  title: "Crontab Expression Generator | DevSign Hub",
  description: "Visual builder that outputs crontab syntax.",
};

export default function Page() {
  return <CrontabGeneratorTool />;
}
