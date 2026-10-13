# /// script
# requires-python = ">=3.10"
# dependencies = ["a12s>=0.7.0"]
# ///
"""Give lead a task, watch lead and worker1 pass it back and forth, and print lead's final answer."""
import sys

import a12s

task = sys.argv[1] if len(sys.argv) > 1 else "What is the capital of Australia? One word."

fleet = a12s.Fleet()  # finds the Fleet started from this folder
lead = fleet.agent_computers.get("lead")

# Watch first: the answer comes in a later Turn of lead, and a Turn that ends before you watch is missed.
with fleet.turns(["lead", "worker1"]) as turns:
    lead.send(task, fresh=True)  # fresh: a new conversation per task
    for t in turns:
        if t.status != "completed":
            sys.exit(f"{t.agent_computer} {t.status}: {t.error}")
        # What an agent sends another is in its send tool calls, not in its text.
        for call in t.tools:
            if call.name == "mcp__a12s__send":
                print(f"{t.agent_computer} -> {call.input['computer']}: {call.input['body']}")
        print(f"{t.agent_computer}: {t.text.strip()}")
        if t.agent_computer == "lead" and "FINAL ANSWER:" in t.text:
            print("\n" + t.text.split("FINAL ANSWER:", 1)[1].strip())
            break
