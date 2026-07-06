import { PR } from "@/components/pr";
import { ModeToggle } from "@/components/ui/theme-toggle";

export default async function Home() {
  return (
    <main className="p-4">
      <ModeToggle />
      <PR />
    </main>
  );
}
