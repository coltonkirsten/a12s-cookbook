# /// script
# requires-python = ">=3.10"
# dependencies = ["a12s>=0.7.0"]
# ///
"""Send one coding agent a task and print its answer as it streams."""
import sys

import a12s

task = sys.argv[1] if len(sys.argv) > 1 else (
    "Write a Python one-liner that prints the first 10 primes, then explain it in one sentence."
)


def show(ev):
    if ev.type == "text.delta":
        print(ev.data["text"], end="", flush=True)
    if ev.type == "tool.started":
        print(f"\n[tool] {ev.data['name']}")


fleet = a12s.Fleet()  # finds the Fleet started from this folder
coder = fleet.agent_computers.get("coder")
turn = coder.send(task).wait(on_event=show)
print(f"\n\nturn {turn.status}")
