# /// script
# requires-python = ">=3.10"
# dependencies = ["a12s>=0.8.1"]
# ///
"""Ask an agent to fix the code in ./project, then show the file it changed on this machine."""
import pathlib
import sys

import a12s

task = sys.argv[1] if len(sys.argv) > 1 else (
    "`python3 stats.py` fails. Fix stats.py so it prints ok, and run it to check."
)

fleet = a12s.Fleet()  # finds the Fleet started from this folder
fixer = fleet.agent_computers.get("fixer")
turn = fixer.send(task, fresh=True).wait()
print(turn.text.strip() if turn.status == "completed" else f"turn {turn.status}: {turn.error}")
# No copy step: the agent wrote to the attached folder, so the change is already here.
print("\n--- project/stats.py on this machine ---")
print((pathlib.Path(__file__).parent / "project" / "stats.py").read_text())
