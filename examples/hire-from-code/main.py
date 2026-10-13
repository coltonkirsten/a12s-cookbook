# /// script
# requires-python = ">=3.10"
# dependencies = ["a12s>=0.6.0"]
# ///
"""Create an agent computer from code, give it a task, print the answer and remove it."""
import sys

import a12s

task = sys.argv[1] if len(sys.argv) > 1 else "Name three prime numbers."

fleet = a12s.Fleet()  # finds the Fleet started from this folder
hello = fleet.agent_computers.create("hello", instructions="Be helpful. Answer in one short paragraph.")
try:
    turn = hello.send(task).wait()
    print(turn.text if turn.status == "completed" else f"turn {turn.status}: {turn.error}")
finally:
    hello.remove()
