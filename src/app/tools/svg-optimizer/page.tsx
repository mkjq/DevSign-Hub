import { SvgOptimizerTool } from "@/components/tools/SvgOptimizerTool";

export const metadata = {
  title: "SVG Code Optimizer | DevSign Hub",
  description: "Clean raw SVG paths and remove metadata bloat.",
};

export default function Page() {
  return <SvgOptimizerTool />;
}
