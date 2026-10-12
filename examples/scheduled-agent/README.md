# Scheduled agent

A clock wakes an agent every minute; your script prints each run as it finishes.

The clock is a **Service**: a small container a12s runs next to your agents. It has no model and no shell access to
the agent. Its only power is the one written in [`fleet.yaml`](fleet.yaml): `grants: { send: [ops] }`, the right to
put a Message in `ops`'s inbox.

## Run it

```sh
a12s up                                   # once per folder before this: a12s creds set anthropic
node watch.ts                             # TypeScript (run `npm install` at the repo root first)
uv run watch.py                           # Python
```

Within a minute:

```text
watching ops; the clock fires every minute…

[2026-10-12T20:57:06.442Z] from service:clock: completed
2026-10-12T20:57:03 UTC, load average 0.97, /home disk use 6% (12G used/224G total)
```

Stop the script with Ctrl-C. The clock keeps going until `a12s down`.

## How it works

- `services.clock` runs a12s's cron Service. Each job has a cron schedule, a target and a body.
- `replace: health-check` means a check that is still waiting (ops was busy) is replaced by the newer one, so a slow
  agent never builds a backlog.
- `turns("ops")` yields each Turn as it finishes. `via` says who sent the Message: `service:clock` here,
  `token:owner` when you send one yourself (`a12s send ops "…"`).

## Next

- Change the schedule: `cron: "0 9 * * 1-5"` is weekdays at 9. Run `a12s up` again to apply.
- Let it sleep between runs: add `power: { sleepAfterIdle: 15m, wakeOnMessage: { from: [service:clock] } }` to `ops`.
- Trigger from GitHub instead of a clock: the webhook Service in
  [Services](https://github.com/coltonkirsten/a12s/blob/main/docs/services.md#the-reference-services).
