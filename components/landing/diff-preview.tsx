const DIFF = [
  { type: "ctx", text: "  function syncInventory(items, warehouse) {" },
  { type: "del", text: "-   items.forEach(i => warehouse.push(i));" },
  { type: "add", text: "+   for (const item of items) {" },
  { type: "add", text: "+     if (!warehouse.has(item.sku)) continue;" },
  { type: "add", text: "+     warehouse.update(item.sku, item.qty);" },
  { type: "add", text: "+   }" },
  { type: "ctx", text: "  }" },
] as const;

export function DiffPreview() {
  return (
    <section className="px-6 pb-20 md:px-10">
      <div className="relative mx-auto max-w-2xl">
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <div className="border-b border-border px-4 py-2 font-mono text-xs text-muted-foreground">
            inventory-sync.ts
          </div>
          <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-6">
            {DIFF.map((line, i) => (
              <div
                key={i}
                className={
                  line.type === "add"
                    ? "text-[#3FB950]"
                    : line.type === "del"
                      ? "text-[#F85149]"
                      : "text-muted-foreground"
                }
              >
                {line.text}
              </div>
            ))}
          </pre>
        </div>

        {/* AI annotation callouts */}
        <div className="absolute -right-4 top-16 hidden w-56 -translate-y-1/2 translate-x-full rounded-md border border-[#7C86FF]/30 bg-[#7C86FF]/10 p-3 font-mono text-xs text-[#7C86FF] lg:block">
          Silent skip on missing SKU — was this intentional, or should it log?
        </div>
        <div className="absolute -left-4 bottom-6 hidden w-56 -translate-x-full rounded-md border border-[#7C86FF]/30 bg-[#7C86FF]/10 p-3 font-mono text-xs text-[#7C86FF] lg:block">
          Old code pushed duplicates. This fixes a real bug, not just style.
        </div>
      </div>
    </section>
  );
}
