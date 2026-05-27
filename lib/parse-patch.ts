export const parsePatch = (
  patch: string,
): { oldCode: string; newCode: string } => {
  if (!patch) return { oldCode: "", newCode: "" };

  const lines = patch.split("\n");
  const oldLines: string[] = [];
  const newLines: string[] = [];

  lines.forEach((line) => {
    if (line.startsWith("@@")) return; // skip hunk headers

    if (line.startsWith("-")) {
      oldLines.push(line.slice(1)); // removed line
    } else if (line.startsWith("+")) {
      newLines.push(line.slice(1)); // added line
    } else {
      // context line — present in both
      oldLines.push(line.slice(1));
      newLines.push(line.slice(1));
    }
  });

  return {
    oldCode: oldLines.join("\n"),
    newCode: newLines.join("\n"),
  };
};
