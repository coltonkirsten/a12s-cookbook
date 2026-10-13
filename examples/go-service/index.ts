// Print each Turn of worker as it ends: the clock Service wakes it with a tick every two minutes.
import { Fleet } from "@coltonkirsten/a12s";

const fleet = await Fleet.connect(); // finds the Fleet started from this folder
console.log("Waiting for ticks from the clock (Ctrl-C to stop)...");
for await (const t of fleet.turns("worker")) {
  const from = t.messages.map((m) => m.via).join(", ") || "-";
  console.log(`[${t.finishedAt}] from ${from}, turn ${t.status}: ${t.status === "completed" ? t.text.trim() : t.error}`);
}
