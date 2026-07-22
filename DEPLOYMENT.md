# Documentation deployment

The Aeris UI documentation is deployed to Vercel at
[`aeris-ui.dev`](https://aeris-ui.dev). Repository configuration keeps builds and routing
reproducible across preview and production deployments.

## Vercel project

Import `Aeris-UI/AerisUI` as a Vercel project with the repository root as the project root. The
version-controlled `vercel.json` supplies the important settings:

| Setting          | Value                         |
| ---------------- | ----------------------------- |
| Framework        | Angular                       |
| Install command  | `npm ci`                      |
| Build command    | `npm run build`               |
| Output directory | `dist/docs/browser`           |
| Node.js          | Latest Vercel Node 24 release |

The full build command checks version metadata and builds the library before the documentation.
This ensures each deployment documents the library produced from the same commit. The SPA rewrite
serves `index.html` for client-side routes while Vercel continues to serve existing static files
directly.

Set `main` as the production branch. Keep Vercel preview deployments enabled for pull requests so
navigation, responsive behavior, themes, and documentation examples can be reviewed before a
production deployment.

## Custom domain

After the first successful preview deployment:

1. Add `aeris-ui.dev` to the Vercel project's Domains settings.
2. Add `www.aeris-ui.dev` and configure it to redirect permanently to `aeris-ui.dev` so there is
   one canonical host.
3. Apply the exact A, CNAME, TXT, or nameserver records shown by Vercel at the domain registrar.
4. Wait for Vercel to verify DNS and provision TLS.
5. Verify the homepage, a deep component URL, a guide URL, static images, downloadable notices,
   and the custom 404 experience.

Do not copy generic DNS values when Vercel shows project-specific records. If email is later added
to the domain, preserve its MX and related TXT records when changing DNS providers or nameservers.

## Production checks

Before promoting a deployment:

- Confirm the Git commit matches the intended library and documentation state.
- Confirm `npm run build`, `npm run test:lib`, and the moderate-threshold dependency audit pass.
- Test light, dark, RTL, palettes, density, corner styles, narrow layouts, keyboard navigation, and
  important deep links on the Vercel preview URL.
- Confirm response headers and HTTPS are present.
- Keep Vercel project and deployment logs private unless there is a deliberate reason to expose
  them.

Package publication remains a separate process. Deploying documentation must never publish
`@aeris-ui/core` to npm.
