// A send box for worker and its live events. The gateway serves this page and the a12s API on the same origin.
import { Fleet } from "@coltonkirsten/a12s";

const fleet = await Fleet.connect(); // in the page, the gateway's /v1/ on this origin
const worker = await fleet.agentComputers.get("worker");
const write = (s) => (document.getElementById("log").textContent += s);

document.getElementById("f").onsubmit = async (e) => {
  e.preventDefault();
  await worker.send(document.getElementById("msg").value);
};

for await (const ev of worker.events()) {
  if (ev.type === "text.delta") write(ev.data.text);
  if (ev.type === "tool.started") write(`\n[tool] ${ev.data.name}\n`);
  if (ev.type === "turn.finished") write(`\nturn ${ev.data.status} ${ev.data.error ?? ""}\n\n`);
}
