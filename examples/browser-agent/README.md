# Browser agent

Give an agent a real browser: your own image with Chromium, and the one sandbox permission Chromium needs.

This is how you extend a12s. The image is yours (`Dockerfile`, built FROM a12s's `slim` image). The security
profile is yours too, and only `fleet.yaml` can set it: a pulled image can never loosen its own sandbox.

## Run it

```sh
docker build -t a12s-cookbook/browser-agent:3 .
a12s creds set anthropic                  # paste the token from `claude setup-token`
a12s up
node index.ts                             # TypeScript (run `npm install` at the repo root first)
uv run main.py                            # Python
node index.ts https://example.com/       # any page on a host in egress.allow
```

`a12s up` says `browser runs with its own seccomp profile`, and `a12s status` shows the profile's digest on the
agent computer's row.

## How it works

- [`Dockerfile`](Dockerfile): `FROM ghcr.io/coltonkirsten/a12s/slim:0.8.1` plus Debian's Chromium. Keeping `slim`
  as the base keeps computerd, which a12s checks for before it runs any image.
- [`browse`](browse): runs headless Chromium through the agent computer's egress proxy, with Chromium's own sandbox on.
  The agent calls it from its shell: `browse --dump-dom <url>` or `browse --screenshot=/tmp/page.png <url>`.
- [`profiles/chromium.json`](profiles/chromium.json): Docker's default seccomp profile plus the user-namespace
  calls Chromium's sandbox needs. Without it Chromium stops with `No usable sandbox!`.
- [`fleet.yaml`](fleet.yaml): `security: { seccomp: ./profiles/chromium.json }` on the `browser` agent computer.
  `a12s up` checks the file, sends the profile with the Fleet, and restarts the agent computer at its next idle
  moment whenever the profile changes. Capabilities and `no-new-privileges` stay as they are.
- `egress.allow` lists the sites the browser may open. Every other host is refused.

## Next

- Add sites to `egress.allow`, e.g. `[api.anthropic.com, example.com, en.wikipedia.org]`.
- Put Playwright in the image (`npm install -g playwright-core`) for scripted clicks and forms.
- [Custom images](https://github.com/coltonkirsten/a12s/blob/main/docs/images.md#custom-images) and
  [seccomp profiles](https://github.com/coltonkirsten/a12s/blob/main/docs/security.md#seccomp)
