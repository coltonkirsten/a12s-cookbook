# Hire from code

Create an agent computer from your program, give it work, and remove it when it's done. The Fleet file has no agent
computers, only `defaults`: a new one needs nothing but a name and its instructions.

## Run it

```sh
a12s creds set anthropic                  # paste the token from `claude setup-token`
a12s up
node index.ts                             # TypeScript (run `npm install` at the repo root first)
uv run main.py "Explain TCP in two sentences."   # Python
```

## How it works

- [`fleet.yaml`](fleet.yaml) sets `defaults` (harness, image, credential, egress) and no agent computers. An agent
  computer's own `credentials` add to the defaults: `credentials: [github]` keeps `anthropic` too.
- `fleet.agent_computers.create("hello", instructions=...)` (TypeScript: `fleet.agentComputers.create`) creates it
  and returns once it is up. The instructions become its `CLAUDE.md`.
- `hello.send(task).wait()` sends the task and returns the Turn that answered it; `hello.remove()` stops and removes it (its disk
  stays until `a12s drive rm home-hello`).

A later `a12s up` in this folder removes `hello` if it still exists, because the file doesn't have it (`a12s export`
first keeps it).
