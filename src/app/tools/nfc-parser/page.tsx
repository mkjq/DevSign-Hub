import { NfcParserTool } from "@/components/tools/NfcParserTool";

export const metadata = {
  title: "NFC Payload Parser | DevSign Hub",
  description: "Decode raw NDEF records into readable payloads.",
};

export default function Page() {
  return <NfcParserTool />;
}
