import { PasswordGeneratorTool } from "@/components/tools/PasswordGeneratorTool";

export const metadata = {
  title: "Secure Password Generator | DevSign Hub",
  description: "Generate uncrackable passwords using entropy rules.",
};

export default function Page() {
  return <PasswordGeneratorTool />;
}
