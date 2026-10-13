# Stream a reply

Send one coding agent a task from a script and print its answer as it streams, tool calls included.

The agent, `coder`, is Claude Code on its own computer: a disk, a shell and a conversation that survives restarts.
Its network is closed except for the Anthropic API.

## Run it

```sh
a12s up                                   # once per folder before this: a12s creds set anthropic
node index.ts                             # TypeScript (run `npm install` at the repo root first)
uv run main.py                            # Python
node index.ts "Write fizzbuzz in Go and run it."   # your own task
```

You'll see something like:

```text
print([n for n in range(2, 1000) if all(n % i for i in range(2, int(n**0.5)+1))][:10])

This list comprehension keeps the numbers with no divisor up to their square root, then takes the first 10.

turn completed
```

## How it works

- [`fleet.yaml`](fleet.yaml) declares one agent computer. `a12s up` starts it.
- `Fleet()` (`Fleet.connect()` in TypeScript) finds the running Fleet from the current folder, and
  `fleet.agent_computers.get("coder")` hands you the agent computer.
- `coder.send(task)` puts a Message in coder's inbox; `.wait()` waits for the Turn that delivers it and returns the
  finished Turn. `onEvent` / `on_event` gets every event on the way: `text.delta` is the agent's text,
  `tool.started` is a tool call.

Run it twice: the second task continues the same conversation. `a12s send coder "…" --fresh --wait` starts a fresh one.

## Next

- Use Codex: `harness: { kind: codex, version: 0.154.0 }` and `credentials: [openai]`.
- Let it reach the web: add hosts to `egress.allow`, e.g. `[api.anthropic.com, github.com, pypi.org]`.
- [SDK reference](https://github.com/coltonkirsten/a12s/blob/main/docs/sdk.md)
