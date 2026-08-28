# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## Deployment

### Frontend: Vercel

The Vercel project uses `vercel.json`.

- Framework: Vite
- Install command: `npm ci`
- Build command: `npm run build`
- Output directory: `dist`

Set this environment variable in Vercel:

```bash
VITE_API_URL=https://precheck-intake-api.onrender.com
```

Replace the value with the actual Render API URL after the backend is deployed.

### Backend API: Render

The Render backend uses `render.yaml`.

- Service root directory: `server`
- Runtime: Node
- Build command: `npm ci && npm run build`
- Start command: `npm start`
- Health check: `/health`

Set this environment variable when Render asks for `sync: false` values:

```bash
FRONTEND_ORIGIN=https://your-vercel-project.vercel.app
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your-turso-auth-token
```

For multiple allowed origins, use a comma-separated value:

```bash
FRONTEND_ORIGIN=https://your-vercel-project.vercel.app,https://www.example.com
```

The API stores intake responses in Turso via libSQL. Local file-based SQLite is not used by the server.
