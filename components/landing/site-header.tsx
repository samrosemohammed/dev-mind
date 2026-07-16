import { ModeToggle } from "@/components/ui/theme-toggle";

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between px-6 py-5 md:px-10">
      <span className="font-mono text-sm tracking-tight text-foreground">
        devmind<span className="text-[#7C86FF]">.</span>
      </span>
      <ModeToggle />
    </header>
  );
}
