# /// script
# requires-python = ">=3.10"
# dependencies = ["a12s>=0.6.0"]
# ///
"""Ask an agent with a browser to read a web page, and print its answer as it streams."""
import sys

import a12s

url = sys.argv[1] if len(sys.argv) > 1 else "https://example.com"
task = f"Run `browse --dump-dom {url}` in your shell. Reply with the page title and its first sentence."


def show(ev):
    if ev.type == "text.delta":
        print(ev.data["text"], end="", flush=True)
    if ev.type == "tool.started":
        print(f"\n[tool] {ev.data['name']}")


fleet = a12s.Fleet()  # finds the Fleet started from this folder
browser = fleet.agent_computers.get("browser")
turn = browser.send(task).wait(on_event=show)
print(f"\n\nturn {turn.status}")
