const FEATURES = [
  {
    title: "Reads the whole diff",
    body: "Not just line-by-line. DevMind traces how a change moves through the codebase, so the summary reflects intent, not a line count.",
  },
  {
    title: "Flags what's risky",
    body: "Surfaces the parts of a change worth a second look: edge cases, missing tests, breaking changes to public APIs.",
  },
  {
    title: "Explains the reasoning",
    body: "Every suggestion comes with the why, not just the what, so you can push back on it or ship with confidence.",
  },
];

export function Features() {
  return (
    <section className="border-t border-border px-6 py-16 md:px-10">
      <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
        {FEATURES.map((f) => (
          <div key={f.title}>
            <h3 className="font-mono text-sm text-foreground">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
