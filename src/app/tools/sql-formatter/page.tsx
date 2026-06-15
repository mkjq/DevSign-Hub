import { SqlFormatterTool } from "@/components/tools/SqlFormatterTool";

export const metadata = {
  title: "SQL Query Formatter | DevSign Hub",
  description: "Format raw SQL queries for readability.",
};

export default function Page() {
  return <SqlFormatterTool />;
}
