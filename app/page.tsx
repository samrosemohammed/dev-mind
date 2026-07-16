import { SiteHeader } from "@/components/landing/site-header";
import { Hero } from "@/components/landing/hero";
import { DiffPreview } from "@/components/landing/diff-preview";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { SiteFooter } from "@/components/landing/site-footer";

export default async function Home() {
  return (
    <main className="flex min-h-full flex-col">
      <SiteHeader />
      <Hero />
      <DiffPreview />
      <Features />
      <HowItWorks />
      <SiteFooter />
    </main>
  );
}
