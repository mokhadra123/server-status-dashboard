# Server Status Dashboard

Interview assessment: a Next.js dashboard for browsing mock servers, inspecting per-server metrics, and signing in with a lightweight mock authentication flow.

## How to run the application

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended, e.g. 20+)
- [pnpm](https://pnpm.io/) (this repo uses a `pnpm-lock.yaml`; npm/yarn also work if you prefer)

### Install dependencies

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The home route sends you to `/login` or `/servers` depending on whether a session cookie is present.

### Production build

```bash
pnpm build
pnpm start
```

### Lint

```bash
pnpm lint
```

### Demo accounts (mock users)

Sign in with any of the seeded users in `src/lib/mock-data/users-data.ts`, for example:

| Email             | Password   |
| ----------------- | ---------- |
| `admin@xorithm.com` | `Admin123!` |
| `jane@xorithm.com`  | `Jane2024!` |

You can also use **Sign up** to create another mock user (stored in memory for the running process only).

---

## Implementation overview and design choices

### Stack

- **Next.js 16** (App Router) with **React 19** and **TypeScript**
- **Tailwind CSS v4** for layout and theming, **`next-themes`** for light/dark mode
- **`recharts`** for response-time history on the server detail view
- **`zod`** for login/signup validation on the server

### Routing and layout

- **`/`** is a small server component that reads the session via `getSession()` and redirects to `/login` or `/servers`.
- **Route groups** keep concerns separated: `(auth)` for login/signup, `(dashboard)` for the main shell (header, navigation, theme switcher).
- **Server detail** lives at `/servers/[id]` as an async server page: it resolves `params`, loads mock data, and uses `notFound()` for unknown IDs.

### Authentication (mock)

- **Server Actions** in `src/app/(auth)/_lib/auth-services.ts` handle login, signup, and logout. Credentials are checked against in-memory mock users; there is no real backend.
- **Session** is an **httpOnly cookie** (`session`) storing a minimal JSON user payload (`id`, `name`, `email`), set/cleared in `src/lib/session.ts`. This keeps secrets out of client-side storage for the assessment while remaining simple to review.
- **`AuthProvider`** (`src/context/auth-context.tsx`) calls **`/api/auth/me`** on mount so the header/account menu can show the current user on the client after hydration.

### Dashboard and data

- **Servers list** is a **client component** that filters, sorts, and debounces search (`useDebounce`) over **`mockServers`** so the UI stays responsive without refetching.
- **Stats cards**, **filters**, and **cards** are split into focused components under `src/app/(dashboard)/servers/_components/`.
- **Detail page** composes info panels, a **Recharts** line chart for `responseHistory`, and a status timeline; **`getServerWithJitter`** simulates small live variation on metrics for a more realistic feel while still using static mock data.

### UX and polish

- Loading states use skeleton UI where appropriate.
- Forms use accessible inputs (including a password field pattern) and surface Zod/server validation errors inline.
- The dashboard shell centralizes header behavior, account menu, and theme switching for a consistent layout across server views.
