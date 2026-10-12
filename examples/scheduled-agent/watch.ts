// Print every Turn the clock triggers on ops. Ctrl-C to stop.
import { connect } from "@coltonkirsten/a12s";

const a12s = await connect();
console.log("watching ops; the clock fires every minute…");
for await (const turn of a12s.turns("ops")) {
  const from = turn.messages.map((m) => m.via).join(", ");
  console.log(`\n[${turn.finishedAt}] from ${from}: ${turn.status}\n${turn.text.trim()}`);
}
