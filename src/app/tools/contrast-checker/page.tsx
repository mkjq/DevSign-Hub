import { ContrastCheckerTool } from "@/components/tools/ContrastCheckerTool";

export const metadata = {
  title: "WCAG Contrast Checker | DevSign Hub",
  description: "Check foreground and background colors for web accessibility.",
};

export default function Page() {
  return <ContrastCheckerTool />;
}
