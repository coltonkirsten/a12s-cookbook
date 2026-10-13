// Send one coding agent a task and print its answer as it streams.
import { Fleet } from "@coltonkirsten/a12s";

const task = process.argv[2] ?? "Write a Python one-liner that prints the first 10 primes, then explain it in one sentence.";

const fleet = await Fleet.connect(); // finds the Fleet started from this folder
const coder = await fleet.agentComputers.get("coder");
const turn = await coder.prompt(task, {
  onEvent: (ev) => {
    if (ev.type === "text.delta") process.stdout.write(ev.data.text);
    if (ev.type === "tool.started") process.stdout.write(`\n[tool] ${ev.data.name}\n`);
  },
});
console.log(`\n\nturn ${turn.status}`);
