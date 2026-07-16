import { PR } from "@/components/pr";

export function Hero() {
  return (
    <section className="px-6 pt-10 pb-16 md:px-10 md:pt-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-mono text-xs text-muted-foreground">
          {"// paste a PR url"}
        </p>
        <h1 className="mt-4 font-mono text-3xl leading-tight tracking-tight text-foreground md:text-5xl">
          Know what changed, and why,
          <br />
          before you open a single file.
        </h1>
        <p className="mt-5 text-balance text-muted-foreground md:text-lg">
          DevMind reads the diff, flags what&apos;s risky, and explains the
          reasoning — so review starts with understanding, not scrolling.
        </p>
      </div>
      <div className="mx-auto mt-10 max-w-md">
        <PR />
      </div>
    </section>
  );
}
