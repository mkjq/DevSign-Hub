import { JwtDecoderTool } from "@/components/tools/JwtDecoderTool";

export const metadata = {
  title: "JWT Decoder & Inspector | DevSign Hub",
  description: "Decode JWT headers, payloads, and verify signatures.",
};

export default function Page() {
  return <JwtDecoderTool />;
}
