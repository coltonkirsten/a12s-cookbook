// Ask an agent with a browser to read a web page, and print its answer as it streams.
import { connect } from "@coltonkirsten/a12s";

const url = process.argv[2] ?? "https://example.com";
const task = `Run \`browse --dump-dom ${url}\` in your shell. Reply with the page title and its first sentence.`;

const a12s = await connect(); // finds the Fleet started from this folder
const turn = await a12s.prompt("browser", task, {
  onEvent: (ev) => {
    if (ev.type === "text.delta") process.stdout.write(ev.data.text);
    if (ev.type === "tool.started") process.stdout.write(`\n[tool] ${ev.data.name}\n`);
  },
});
console.log(`\n\nturn ${turn.status}`);
