# BhoomiSetu Frontend

This package contains the public-facing Land Information Governance Platform prototype. It is a React single-page application built with Vite. Its land, research and policy screens currently read local demonstration data; they do not fetch verified land records or use the repository's Express scaffold.

For the full repository documentation—including the separate SIH 2026 dashboard and FastAPI prototype, architecture, database schema, and API reference—see the [repository README](../README.md).

## Features

- Home page introducing the platform.
- Explore page with state/district selectors, land classification charts and government/private share visualizations.
- Research page with sample catalogue search and category filters.
- Policies page with sample directory search, jurisdiction and category filters.
- About page describing the project goals.
- Login and sign-up screens for public, researcher and government roles.
- Responsive layouts and shared site navigation/footer.

All land statistics and catalogue entries are demonstration content in `src/data/mockData.js`. Policy descriptions are illustrative and do not replace official legal sources. This frontend does not independently verify land ownership or government records.

## Routes

| Route | Page |
|---|---|
| `/` | Home |
| `/explore` | Land data explorer |
| `/research` | Sample research catalogue |
| `/policies` | Sample policy directory |
| `/about` | About the project |
| `/signup` | Select sign-up role |
| `/signup/:role` | Sign-up form for a role |
| `/login` | Select login role |
| `/login/:role` | Login form for a role |
| Other paths | Not found page |

## Technology

| Package | Purpose |
|---|---|
| React 19 and React DOM | UI rendering |
| React Router 7 | Client-side routes |
| Vite 8 and `@vitejs/plugin-react` | Development server and production build |
| Oxlint | Lint command |
| Prettier | Formatting command |

The versions are declared as semver ranges in `package.json`; use the checked-in `package-lock.json` for reproducible installs.

## Requirements

- Node.js with npm.
- Install dependencies from this directory:

```bash
npm install
```

## Development

Start the Vite development server:

```bash
npm run dev
```

Vite prints the local URL in the terminal (normally `http://localhost:5173`). The repository root also provides convenience scripts that delegate to this package.

## Available scripts

Run these commands from `frontend/`:

| Command | Action |
|---|---|
| `npm run dev` | Start Vite in development mode. |
| `npm run build` | Build the static application into `dist/`. |
| `npm run preview` | Serve the production build locally. |
| `npm run lint` | Run Oxlint. |
| `npm run format` | Format frontend source, Vite config and HTML with Prettier. |

## Data and account behavior

The Explore page reads sample land figures, while Research and Policies read sample catalogue entries, from `src/data/mockData.js`. The UI supports filtering and selection locally. It does not connect to a database or external land-data service.

Public demo sign-up stores a name, email and role in browser `localStorage`; login checks that local demo record. Researcher and government sign-up display a verification-required state, but no verification service or authentication API is connected. Do not use real credentials or sensitive identity information with this prototype.

## Configuration and backend

The frontend has no required environment variables. No API base URL is configured in this package. The repository's separate Express server is not called by this UI. The sibling SIH prototype has its own frontend, backend, environment configuration and setup; see the [repository README](../README.md) for details.

## Screenshots

No application screenshots are currently included. Add captured images here when available, and identify any demonstration data displayed in them.

## License

No license file or license declaration was found at the repository root. Reuse and distribution terms are unspecified.
