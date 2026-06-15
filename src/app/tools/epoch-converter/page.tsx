import { EpochConverterTool } from "@/components/tools/EpochConverterTool";

export const metadata = {
  title: "Epoch Timestamp Converter | DevSign Hub",
  description: "Convert Unix timestamps to human-readable dates.",
};

export default function Page() {
  return <EpochConverterTool />;
}
