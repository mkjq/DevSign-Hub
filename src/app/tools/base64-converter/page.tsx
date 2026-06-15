import { Base64ConverterTool } from "@/components/tools/Base64ConverterTool";

export const metadata = {
  title: "Base64 Text & File Converter | DevSign Hub",
  description: "Encode/Decode strings and raw files to/from Base64.",
};

export default function Page() {
  return <Base64ConverterTool />;
}
