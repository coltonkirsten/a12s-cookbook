# Hand off

Hand work from one agent to another. `lead` gets the task, sends it to `worker1` and ends its Turn; `worker1` does
the work and sends the result back; `lead` answers with it. Your program watches both and prints the answer.

## Run it

```sh
a12s up                                   # once per folder before this: a12s creds set anthropic
node index.ts                             # TypeScript (run `npm install` at the repo root first)
uv run main.py                            # Python
uv run main.py "Is 1001 prime? Show the factors."   # your own task
```

You'll see something like:

```text
lead -> worker1: What is the capital of Australia? Answer in one word and send it back to lead.
lead: DISPATCHED
worker1 -> lead: RESULT: Canberra
worker1: SENT
lead: FINAL ANSWER: Canberra

Canberra
```

## How it works

- [`fleet.yaml`](fleet.yaml): `grants: { send: [worker1] }` lets lead put Messages in worker1's inbox with its
  `send` tool (`mcp__a12s__send`), and worker1 has the same grant back to lead. The instructions say what to do with a
  Message depending on where it came from: one from worker1 arrives `via="computer:worker1"`.
- lead doesn't wait for worker1. It replies `DISPATCHED` and ends its Turn; worker1's result is a new Message, and
  so a new Turn of lead.
- `fleet.turns(["lead", "worker1"])` yields each finished Turn of either agent. The program starts watching before it
  sends (`await turns.ready()` in TypeScript, `with fleet.turns(...)` in Python), because the answer comes in a later
  Turn of lead than the one the task starts.
- `send(task, fresh: true)` (`fresh=True` in Python) starts a new conversation for each task.

## Gotchas

- A worker's result is in its send call, not in its text: `t.tools`, the call named `mcp__a12s__send`, with input
  `{computer, body}`. Its `t.text` is only `SENT`.
- The receiver's Turn can finish before the sender's, because a send happens in the middle of a Turn. Match Turns by
  agent computer and content, never by the order they arrive.
- Without `fresh`, lead remembers earlier tasks and may repeat an old answer.
- To make the pair from code instead of `fleet.yaml`, create them one after the other with
  `fleet.agent_computers.create(...)`: a grant may name an agent computer that doesn't exist yet (the write warns).

## Next

- More workers: add `worker2` with `grants: { send: [lead] }`, add it to lead's `grants.send`, and tell lead in its
  instructions how to split the work.
- [Inbox and Messages](https://github.com/coltonkirsten/a12s/blob/main/docs/inbox.md)
