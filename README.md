# a12s cookbook

Small, complete examples for [a12s](https://github.com/coltonkirsten/a12s): AI coding agents (Claude Code, Codex)
running as isolated computers on Docker, driven from your own code.

Each example is one folder: a `fleet.yaml` that declares the agents, and the same program in TypeScript and Python.

## Examples

| Example | What it shows | TypeScript | Python |
|---|---|---|---|
| [Stream a reply](examples/stream-a-reply) | Send one coding agent a task from a script and print its answer as it streams. | [index.ts](examples/stream-a-reply/index.ts) | [main.py](examples/stream-a-reply/main.py) |
| [Browser agent](examples/browser-agent) | Extend a12s: your own image with Chromium, and a seccomp profile set in `fleet.yaml`. | [index.ts](examples/browser-agent/index.ts) | [main.py](examples/browser-agent/main.py) |

## Before you start

You need Docker running, [a12s](https://github.com/coltonkirsten/a12s#install), Node 24+ or
[uv](https://docs.astral.sh/uv/), and a Claude token from `claude setup-token`.

```sh
git clone https://github.com/coltonkirsten/a12s-cookbook && cd a12s-cookbook
npm install                        # TypeScript only; Python examples install their own dependency
```

## Run any example in 3 commands

```sh
cd examples/stream-a-reply
a12s up
node index.ts                      # or: uv run main.py
```

The first `a12s up` in a folder stops and tells you to run `a12s creds set anthropic`: paste your token, then run
`a12s up` again. `a12s down` stops the example and keeps its disks. `a12s down --purge` removes everything.

## Contributing

New examples are welcome. Keep one folder per example with a README, a `fleet.yaml`, and both a TypeScript and a
Python version that run against the latest a12s release.

MIT licensed.
