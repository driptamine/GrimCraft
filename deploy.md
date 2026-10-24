# Deploy

This repo builds a static Vite site. Both Netlify and GitHub Pages deploy the generated `dist/` directory.

Tested locally with:

- Node `v22.21.0`
- npm `10.9.4`

## 1. Build the site

```bash
npm install
npm test -- --runInBand
npm run build
```

The deployable output is:

```text
dist/
```

You can sanity-check it locally with:

```bash
npm run preview
```

## 2. Understand the runtime assets

A normal build always syncs `maps/` into `dist/`. It does **not** bundle `models/` by default.

Local sizes for reference:

- `dist/`: about `38M`
- `maps/`: about `19M`
- `models/`: about `1.1G`

Individual model files can be tens of megabytes, so do not commit or upload the whole model tree unless the hosting plan and repository limits allow it.

Use one of these strategies:

### A. External model hosting

Set the public model URL (r2.dev public URL or custom domain — it serves the
bucket root, so no bucket segment is needed):

```bash
R2_ENDPOINT_URL=https://pub-abcdefgh.r2.dev
```

Then build normally:

```bash
npm run build
```

Production builds use those variables to rewrite model URLs through `VITE_MODEL_BASE`.
UI images (`assets/icons/`, `assets/command_icons/`, resource glyphs) are not
bundled by vite, so the same endpoint also serves them via `VITE_ASSET_BASE`
(`R2_ASSET_BASE` overrides when icons live elsewhere).

Upload the models with the S3-compatible API — the Cloudflare dashboard caps
manual uploads at 100 files, and `models/` holds ~1400:

```bash
npm run models:r2:sync
```

Dry-run first with `npm run models:r2:sync -- --dryrun`. The script needs
`R2_BUCKET_NAME`, `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID` and `R2_SECRET_ACCESS_KEY`
(see `.env.example`); it skips `*.tga`/`*.zip` sidecars, mirroring the local
sync rules.

Upload the UI assets the same way (`assets/` holds ~1100 files):

```bash
npm run assets:r2:sync
```

### B. Fully self-contained build

```bash
GRIM_SYNC_MODELS=1 npm run build
```

Or:

```bash
npm run build
npm run sync-assets
```

This is simple, but the resulting `dist/` is very large and is usually unsuitable for Netlify or GitHub Pages.

## 3. Deploy to Netlify

1. Push the repository to GitHub or GitLab.
2. In Netlify, choose **Add new site → Import an existing project**.
3. Select the repository.
4. Use these build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Set Node to version 20 or newer. Node 22 is known to work.
6. If models are hosted externally, add:
   - `R2_ENDPOINT_URL`
   - `R2_BUCKET_NAME`
7. Deploy the site.

Netlify serves the site from the domain root by default, which matches this project's Vite configuration.

### Deploy to Netlify from GitHub Actions

Use this when the repository stays on GitHub but the Netlify deployment should run from a workflow.

1. In Netlify, select the site and copy its **Site ID**.
2. Create a Netlify personal access token.
3. In GitHub, open `driptamine/GrimCraft → Settings → Secrets and variables → Actions`.
4. Add these repository secrets:
   - `NETLIFY_AUTH_TOKEN`
   - `NETLIFY_SITE_ID`
   - Optionally, `R2_ENDPOINT_URL` and `R2_BUCKET_NAME`
5. Add `.github/workflows/deploy-netlify.yml`:

```yaml
name: Deploy Netlify

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read

concurrency:
  group: netlify
  cancel-in-progress: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      # No test step: tests asserting on models/ need the gitignored 1.1 GB
      # tree; they run locally via npm test -- --runInBand.
      - run: npm run build
        env:
          R2_ENDPOINT_URL: ${{ secrets.R2_ENDPOINT_URL }}
          R2_BUCKET_NAME: ${{ secrets.R2_BUCKET_NAME }}
      # The Netlify CLI also runs the site's build command from the app
      # settings, so it needs the R2 base too — otherwise it would rebuild
      # dist/ without models and deploy that instead.
      - run: npx --yes netlify-cli deploy --dir=dist --prod
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
          R2_ENDPOINT_URL: ${{ secrets.R2_ENDPOINT_URL }}
```

Remove `--prod` if the workflow should create a draft preview deployment instead of updating production.

## 4. Deploy to GitHub

This repository is `driptamine/GrimCraft`.

### Recommended: user site or custom domain

GitHub Pages works most reliably when the game is served from the domain root, for example:

- `https://driptamine.github.io/`
- `https://www.example.com/`

The default Vite base path (`/`) already matches that layout.

Enable Pages:

1. Open `driptamine/GrimCraft → Settings → Pages`.
2. Under **Build and deployment**, select **GitHub Actions**.
3. Add a workflow such as `.github/workflows/deploy-pages.yml`:

```yaml
name: Deploy Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      # No test step: tests asserting on models/ need the gitignored 1.1 GB
      # tree; they run locally via npm test -- --runInBand.
      - run: npm run build
        env:
          R2_ENDPOINT_URL: ${{ secrets.R2_ENDPOINT_URL }}
          R2_BUCKET_NAME: ${{ secrets.R2_BUCKET_NAME }}
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - id: deployment
        uses: actions/deploy-pages@v4
```

Omit the two `R2_*` secrets only if the deployment intentionally does not need external models.

### Project-site caveat

A repository project site has a subpath such as:

```text
https://driptamine.github.io/GrimCraft/
```

That layout currently needs extra work: several runtime asset paths are root-absolute, including `/maps/...` and `/assets/...`. Building with a repository subpath alone is therefore not enough without also updating those asset URLs.

## 5. Required deployment data

Replace every placeholder before deploying. Do not commit real tokens.

| Required data | Example/placeholder | Used for | Where it goes |
| --- | --- | --- | --- |
| GitHub repository URL | `https://github.com/driptamine/GrimCraft.git` | Source checkout and Netlify import | Git provider and Netlify |
| Deployment branch | `main` | Workflow triggers | GitHub workflow `on.push.branches` |
| Netlify production URL | `https://SITE.netlify.app` | Production smoke check | Browser |
| Netlify Site ID | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` | GitHub Action targeting the Netlify site | GitHub secret `NETLIFY_SITE_ID` |
| Netlify personal access token | `nfp_...` | Authenticating the GitHub Action to Netlify | GitHub secret `NETLIFY_AUTH_TOKEN` |
| Model endpoint URL | `https://example.r2.cloudflarestorage.com` | Production external model base | `R2_ENDPOINT_URL` build secret/variable |
| Model bucket name | `litloop-cloudflare-bucket` | Upload target for `models:r2:sync` | `R2_BUCKET_NAME` local env / CI secret |
| R2 account ID | `abc123...` | S3 API upload endpoint | `R2_ACCOUNT_ID` local env / CI secret |
| R2 API access key | `...` | Authenticating model uploads | `R2_ACCESS_KEY_ID` local env / CI secret |
| R2 API secret key | `...` | Authenticating model uploads | `R2_SECRET_ACCESS_KEY` local env / CI secret |
| Custom domain, if used | `https://www.example.com/` | Production user-facing URL | DNS records and hosting domain settings |
