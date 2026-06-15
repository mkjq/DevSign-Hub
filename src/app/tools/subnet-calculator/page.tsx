import { SubnetCalculatorTool } from "@/components/tools/SubnetCalculatorTool";

export const metadata = {
  title: "Subnet Calculator | DevSign Hub",
  description: "Calculate IPv4 subnets, CIDR ranges, and network details.",
};

export default function SubnetCalculatorPage() {
  return <SubnetCalculatorTool />;
}
