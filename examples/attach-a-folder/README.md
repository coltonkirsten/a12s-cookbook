# Attach a folder

Let an agent work on a folder of this machine in place. `attach` mounts [`project/`](project) into the agent
computer at `/home/agent/project`: the agent fixes the bug there, and the fix is in your folder the moment it saves.
No copying in or out.

## Run it

```sh
a12s creds set anthropic                  # paste the token from `claude setup-token`
a12s up
node index.ts                             # TypeScript (run `npm install` at the repo root first)
uv run main.py                            # Python
```

`a12s up` says `fixer has …/project at /home/agent/project (read-write)`. You'll see something like:

```text
I'll start by looking at stats.py to see what fails.
...
Fixed mean() (removed the stray `- 1`) and median() (averages the two middle values); `python3 stats.py` prints ok.

--- project/stats.py on this machine ---
def mean(xs):
    return sum(xs) / len(xs)
...
```

The program changes `project/stats.py` in this repo: `git diff` shows the agent's edit, and
`git checkout examples/attach-a-folder/project` puts the bug back to run it again.

## How it works

- [`fleet.yaml`](fleet.yaml): `attach: { project: { host: ./project } }`. The name (`project`) is where it is mounted
  under `/home/agent`; `host` is relative to `fleet.yaml`. The instructions tell the agent where its project is,
  because the harness still starts in `/home/agent`.
- Writes go both ways at once: edit `project/stats.py` while the agent works and it sees your change. Nothing merges,
  so the last save wins.
- On macOS (Docker Desktop) files the agent writes are yours. On Linux the folder must be writable by uid 1000.
- `send(task, fresh: true)` (`fresh=True`) starts a new conversation, so a second run doesn't remember the first.

## Gotchas

- Only the Fleet owner may set `attach`, and never in `defaults`. `a12s up` refuses `~`, `~/.a12s` and `~/.docker`.
- Docker Desktop must share the folder. `/Users`, `/Volumes`, `/private`, `/tmp` and `/var/folders` are shared by
  default; anything else puts the agent computer in `Error` with the fix.
- `a12s down --purge` destroys a12s's drives, never the attached folder.

## Next

- Your own project: `host: ~/code/myapp`, and `egress.allow` for its registries (`registry.npmjs.org`, `pypi.org`).
- Keep installs off your disk: `keep: [node_modules, .venv]` puts those paths on a12s drives of their own, so Linux
  binaries never land in a macOS folder.
- Look but don't touch: `readOnly: true`.
- [Fleet file: Attached folders](https://github.com/coltonkirsten/a12s/blob/main/docs/fleet-file.md#attached-folders)
