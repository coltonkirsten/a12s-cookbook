# /// script
# requires-python = ">=3.10"
# dependencies = ["a12s>=0.7.0"]
# ///
"""Print each Turn of worker as it ends: the clock Service wakes it with a tick every two minutes."""
import a12s

fleet = a12s.Fleet()  # finds the Fleet started from this folder
print("Waiting for ticks from the clock (Ctrl-C to stop)...")
with fleet.turns("worker") as turns:
    for t in turns:
        sender = ", ".join(m.via for m in t.messages) or "-"
        answer = t.text.strip() if t.status == "completed" else t.error
        print(f"[{t.finished_at}] from {sender}, turn {t.status}: {answer}")
