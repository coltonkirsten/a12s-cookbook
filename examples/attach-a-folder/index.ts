// Ask an agent to fix the code in ./project, then show the file it changed on this machine.
import { readFileSync } from "node:fs";
import { Fleet } from "@coltonkirsten/a12s";

const task = process.argv[2] ?? "`python3 stats.py` fails. Fix stats.py so it prints ok, and run it to check.";

const fleet = await Fleet.connect(); // finds the Fleet started from this folder
const fixer = await fleet.agentComputers.get("fixer");
const turn = await fixer.send(task, { fresh: true }).wait();
console.log(turn.status === "completed" ? turn.text.trim() : `turn ${turn.status}: ${turn.error}`);
// No copy step: the agent wrote to the attached folder, so the change is already here.
console.log(`\n--- project/stats.py on this machine ---\n${readFileSync(new URL("project/stats.py", import.meta.url), "utf8")}`);
