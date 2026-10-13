// Create an agent computer from code, give it a task, print the answer and remove it.
import { Fleet } from "@coltonkirsten/a12s";

const task = process.argv[2] ?? "Name three prime numbers.";

const fleet = await Fleet.connect(); // finds the Fleet started from this folder
const hello = await fleet.agentComputers.create("hello", { instructions: "Be helpful. Answer in one short paragraph." });
try {
  const turn = await hello.prompt(task);
  console.log(turn.status === "completed" ? turn.text : `turn ${turn.status}: ${turn.error}`);
} finally {
  await hello.remove();
}
