# Vite Workflow (for opencode agents)

## Development iteration — ALWAYS use this

```sh
npm run dev
```

Starts dev server at http://localhost:3000 with instant HMR.
Files are served as native ESM — no bundle step.

Use this for ALL code-and-test work: fixing bugs, adding features,
verifying changes. NEVER use `npm run build` during development.

## Production build — ONLY for deployment

```sh
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

Requires 4GB heap due to Fluent UI (inspector dependency).
Only needed before `npm run preview` or uploading dist/ to a host.
