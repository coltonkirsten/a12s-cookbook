// Send one coding agent a task and print its answer as it streams.
import { connect } from "@coltonkirsten/a12s";

const task = process.argv[2] ?? "Write a Python one-liner that prints the first 10 primes, then explain it in one sentence.";

const a12s = await connect(); // finds the Fleet started from this folder
const turn = await a12s.prompt("coder", task, {
  onEvent: (ev) => {
    if (ev.type === "text.delta") process.stdout.write(ev.data.text);
    if (ev.type === "tool.started") process.stdout.write(`\n[tool] ${ev.data.name}\n`);
  },
});
console.log(`\n\nturn ${turn.status}`);
