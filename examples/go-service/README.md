# Go service

A Service written in Go: a clock that sends an agent a tick every two minutes. The agent sleeps when it is idle, and
the clock's Message wakes it. Your program watches the agent's Turns and prints them.

A Service is an image a12s runs next to the agent computers. It has no harness and no inbox, and it may only do what
its grants say: here, `grants.send` lets the clock put Messages in `worker`'s inbox, and nothing else.

## Run it

You need Go 1.26+ and Docker.

```sh
(cd clock && go mod tidy)                 # writes go.sum
docker build -t a12s-cookbook/clock:2 clock
a12s creds set anthropic                  # paste the token from `claude setup-token`
a12s up
node index.ts                             # TypeScript (run `npm install` at the repo root first)
uv run main.py                            # Python
```

Build the image before `a12s up`: the Fleet names it, and a12s doesn't build it for you. Every two minutes you'll see
something like:

```text
[2026-10-12T22:04:31Z] from service:clock, turn completed: Hello! It's Mon Oct 12 22:04:29 UTC 2026.
```

`a12s service logs clock -f` shows the clock's side (`sent m_… (pending)`), and `a12s status` shows `worker` going
to sleep between ticks.

## How it works

- [`clock/main.go`](clock/main.go) uses [svckit](https://github.com/coltonkirsten/a12s/tree/main/services/svckit),
  a small package (standard library only) in the a12s module:
  - `svckit.LoadConfig` reads the Service's `config` from `fleet.yaml` (`/run/a12s/config/config.json`).
  - `svckit.NewClient()` is an HTTP client for the a12s API with the Service's own certificate (`A12S_API` and
    `/run/a12s/tls`).
  - `c.Send(to, svckit.Enqueue{...})` puts a Message in that agent computer's inbox. It arrives
    `via="service:clock"`. `ReplaceKey: "tick"` replaces a tick still waiting in the inbox, so ticks don't pile up.
    `Enqueue` also has `Metadata`, `Fresh` and `Expires` (seconds).
  - `svckit.Health(mux)` answers `GET /healthz`, the health check in `service.json`.
- [`clock/service.json`](clock/service.json) is the manifest every Service image carries at `/a12s/service.json`:
  its name, the uid it runs as (never 0; match the Dockerfile's `USER`), and its health check. The process runs on a
  read-only root filesystem with no capabilities, and a Service that exits is restarted.
- [`clock/Dockerfile`](clock/Dockerfile) builds a static binary and copies it and the manifest into Alpine.
- [`fleet.yaml`](fleet.yaml): the `clock` Service with `grants: { send: [worker] }` and its `config`, and `worker`
  with `power: { sleepAfterIdle: 30s, wakeOnMessage: { from: [service:clock], maxWakesPerHour: 30 } }`. Only senders
  listed in `wakeOnMessage.from` wake it; the default limit is 6 wakes an hour, too few for a tick every two minutes.
- `fleet.turns("worker")` yields each of worker's Turns as it ends; `t.messages` says who sent the work.

## go.mod and go.sum

svckit is a package inside the module `github.com/coltonkirsten/a12s`; there is no separate svckit module or tag.
[`clock/go.mod`](clock/go.mod) requires that module at the a12s release you run. Don't hand-write `go.sum`: `go mod
tidy` fills it, and the Dockerfile copies both, so run it before the first `docker build`.

To start your own Service from scratch:

```sh
mkdir clock && cd clock && go mod init example.com/clock
go get github.com/coltonkirsten/a12s/services/svckit@v0.8.1
# write main.go, then:
go mod tidy
```

## Next

- Send to more agents: list them in `grants.send` and send to each.
- Give the Service settings as environment variables: `config: { env: { LOG_LEVEL: debug } }`. The `env` map in
  `config` is exported into the Service's environment.
- Any language works: read `/run/a12s/config/config.json` and `POST $A12S_API/v1/agent-computers/{name}/inbox` with
  the client certificate in `/run/a12s/tls/{ca.crt,cert.pem,key.pem}`.
- No Service needed for a plain schedule: host cron running `a12s -F ~/proj/fleet.yaml send worker "…" --replace daily`.
- [Services](https://github.com/coltonkirsten/a12s/blob/main/docs/services.md)
