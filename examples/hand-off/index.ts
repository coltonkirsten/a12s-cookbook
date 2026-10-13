// Give lead a task, watch lead and worker1 pass it back and forth, and print lead's final answer.
import { Fleet } from "@coltonkirsten/a12s";

const task = process.argv[2] ?? "What is the capital of Australia? One word.";

const fleet = await Fleet.connect(); // finds the Fleet started from this folder
const lead = await fleet.agentComputers.get("lead");

// Watch first: the answer comes in a later Turn of lead, and a Turn that ends before you watch is missed.
const turns = fleet.turns(["lead", "worker1"]);
await turns.ready();
await lead.send(task, { fresh: true }); // fresh: a new conversation per task

for await (const t of turns) {
  if (t.status !== "completed") {
    console.error(`${t.agentComputer} ${t.status}: ${t.error}`);
    process.exitCode = 1;
    break;
  }
  // What an agent sends another is in its send tool calls, not in its text.
  for (const call of t.tools.filter((c) => c.name === "mcp__a12s__send")) {
    const { computer, body } = call.input as { computer: string; body: string };
    console.log(`${t.agentComputer} -> ${computer}: ${body}`);
  }
  console.log(`${t.agentComputer}: ${t.text.trim()}`);
  if (t.agentComputer === "lead" && t.text.includes("FINAL ANSWER:")) {
    console.log(`\n${t.text.split("FINAL ANSWER:")[1].trim()}`);
    break;
  }
}
