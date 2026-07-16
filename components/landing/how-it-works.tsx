const STEPS = [
  {
    n: "01",
    title: "Paste a PR URL",
    body: "Drop in the link to any GitHub pull request.",
  },
  {
    n: "02",
    title: "DevMind reads the diff",
    body: "It parses every changed file, not just the summary GitHub shows you.",
  },
  {
    n: "03",
    title: "Get a structured review",
    body: "A breakdown of intent, risk, and suggestions — ready before you write a comment.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-t border-border px-6 py-16 md:px-10">
      <div className="mx-auto max-w-4xl">
        <ol className="grid gap-8 md:grid-cols-3">
          {STEPS.map((s) => (
            <li key={s.n}>
              <span className="font-mono text-xs text-[#7C86FF]">{s.n}</span>
              <h3 className="mt-2 font-mono text-sm text-foreground">
                {s.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
