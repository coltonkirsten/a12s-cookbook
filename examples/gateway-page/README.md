# Gateway page

A web page that talks to an agent: a send box for `worker` and its live events, served by `a12s gateway`.

This example is browser-only, so it has no `index.ts` or `main.py`: the program is [`main.js`](main.js), and it runs
in the page.

## Run it

```sh
npm install                               # in this folder: vite and @coltonkirsten/a12s
a12s creds set anthropic                  # paste the token from `claude setup-token`
a12s up
a12s gateway -- npx vite
```

The gateway starts Vite, waits for the `http://localhost:<port>` URL it prints, and serves it with hot reload. It
prints and opens `http://127.0.0.1:7012/?key=…`. Use that link, not Vite's own port: the key becomes a cookie that
the API needs. Type a task, press Send, and worker's answer streams in below.

## How it works

- `a12s gateway` serves your app and, on the same origin, the a12s API at `/v1/` under a scoped token the page never
  sees. It serves only your app; for a dashboard of the whole Fleet, use the console (`a12s ui`).
- The page imports `@coltonkirsten/a12s` through a bundler (Vite here); that is the only way in. No Vite config is
  needed.
- In the page, `Fleet.connect()` finds the API on its own origin. `worker.send(text)` puts a Message in worker's
  inbox, and `worker.events()` streams its events: `text.delta` is its text, `tool.started` a tool call,
  `turn.finished` the end of a Turn.
- The page may use `status`, `events`, `send` and `inbox` on every agent computer, but not create or change them.
  `--allow status,events` narrows that. Messages from the page arrive `via="token:gateway-7012"`.
- The key is new on each run. Scripts and tests can use it as a token:
  `Fleet.connect({ url: "http://127.0.0.1:7012", token: key })`.

## Other ways to serve it

```sh
a12s gateway -- npm run dev               # any dev server command (Next.js, …)
a12s gateway --dev http://localhost:5173  # a dev server that is already running
npx vite build && a12s gateway --web dist # the built app
```

Run the gateway in the Fleet's folder, or point it at the Fleet file with `-F path/fleet.yaml`. It listens on loopback
only. To serve other people, run your own server with a login that calls a12s with a narrow token, e.g.
`a12s token create web --actions send,status --agent-computers worker`.

## Next

- [SDK: In the browser](https://github.com/coltonkirsten/a12s/blob/main/docs/sdk.md#in-the-browser)
