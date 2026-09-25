# pong-claude

A basic Pong game: human player (left paddle, keyboard) vs. a simple
computer opponent (right paddle). Static, client-side only — no backend,
no build step. See [`specs/PON-1.md`](specs/PON-1.md) for the full spec and
design.

## Running locally

Just open `index.html` in a browser, or serve the repo root with any static
file server, e.g.:

```sh
npx serve .
# or
python3 -m http.server 8000
```

Then visit the served URL. Controls: `Up`/`Down` arrow keys or `W`/`S` move
the left (player) paddle; the right paddle is controlled by the computer.

## Build & deploy

No build step — the checked-in files are served as-is. GitHub Actions
(`.github/workflows/deploy.yml`) zips the repo root and uploads it to the
hosting platform on every push:

- Push to **`dev`** → deploys to **staging**: https://pong-dev-coolify.bogdanripa.com
- Push to **`main`** → deploys to **production**: https://pong-coolify.bogdanripa.com

Development branch: `dev` (staging). Production branch: `main` (production).
All feature work happens on a `task/<KEY-N>` branch off `dev`, merged into
`dev` via pull request; `dev` is later released into `main` via pull request.
