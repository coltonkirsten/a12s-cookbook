# a12s cookbook

Small, complete examples for [a12s](https://github.com/coltonkirsten/a12s): AI coding agents (Claude Code, Codex)
running as isolated computers on Docker, driven from your own code.

Each example is one folder: a `fleet.yaml` that declares the agents, and the same program in TypeScript and Python
(browser-only examples have just the page).

## Examples

| Example | What it shows | TypeScript | Python |
|---|---|---|---|
| [Hire from code](examples/hire-from-code) | Create an agent computer from your program, send it a task and remove it. | [index.ts](examples/hire-from-code/index.ts) | [main.py](examples/hire-from-code/main.py) |
| [Stream a reply](examples/stream-a-reply) | Send one coding agent a task from a script and print its answer as it streams. | [index.ts](examples/stream-a-reply/index.ts) | [main.py](examples/stream-a-reply/main.py) |
| [Browser agent](examples/browser-agent) | Extend a12s: your own image with Chromium, and a seccomp profile set in `fleet.yaml`. | [index.ts](examples/browser-agent/index.ts) | [main.py](examples/browser-agent/main.py) |
| [Hand off](examples/hand-off) | Hand work from one agent to another: a lead dispatches to a worker and gets the result back. | [index.ts](examples/hand-off/index.ts) | [main.py](examples/hand-off/main.py) |
| [Go service](examples/go-service) | A Service written in Go with svckit: a clock that wakes a sleeping agent with a tick. | [index.ts](examples/go-service/index.ts) | [main.py](examples/go-service/main.py) |
| [Attach a folder](examples/attach-a-folder) | An agent works on a folder of this machine in place: it fixes a bug and the fix lands in your folder. | [index.ts](examples/attach-a-folder/index.ts) | [main.py](examples/attach-a-folder/main.py) |
| [Gateway page](examples/gateway-page) | A browser page with a send box and live events, served by `a12s gateway -- npx vite`. | [main.js](examples/gateway-page/main.js) (browser) | - |

## Start here

You need Docker running, Node 24+ (TypeScript) or [uv](https://docs.astral.sh/uv/) (Python), and a Claude token:
run `claude setup-token` and copy the `sk-ant-oat…` it prints.

```sh
brew install coltonkirsten/tap/a12s       # the a12s CLI, v0.8.1 (or a binary from the a12s Releases page)
git clone https://github.com/coltonkirsten/a12s-cookbook && cd a12s-cookbook
npm install                               # TypeScript only; Python examples install their own dependency
cd examples/stream-a-reply
a12s creds set anthropic                  # paste the token
a12s up                                   # starts the agent computer on Docker
node index.ts                             # or: uv run main.py
```

Every example folder is its own Fleet with its own token: run `a12s creds set anthropic` in a folder before its first
`a12s up`, and again after `a12s down`, which stops the example, keeps its disks and forgets the token.
`a12s down --purge` removes the disks too.
The examples use Claude Haiku; change `model` in a `fleet.yaml` to use another.

## Contributing

New examples are welcome. Keep one folder per example with a README, a `fleet.yaml`, and both a TypeScript and a
Python version that run against the latest a12s release (a browser-only example has its page instead).

MIT licensed.
