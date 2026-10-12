# /// script
# requires-python = ">=3.10"
# dependencies = ["a12s>=0.2.1"]
# ///
"""Print every Turn the clock triggers on ops. Ctrl-C to stop."""
import a12s

client = a12s.connect()
print("watching ops; the clock fires every minute…", flush=True)
for turn in client.turns("ops"):
    sender = ", ".join(m.via for m in turn.messages)
    print(f"\n[{turn.finished_at}] from {sender}: {turn.status}\n{turn.text.strip()}", flush=True)
