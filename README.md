# Server Status Dashboard

Interview assessment: a Next.js dashboard for browsing mock servers, inspecting per-server metrics, and signing in with a lightweight mock authentication flow.

## How to run the application

### Prerequisites

- [Node.js](https://nodejs.org/) 20 or newer (LTS recommended)
- [pnpm](https://pnpm.io/) — the repo includes `pnpm-lock.yaml`

You can use **npm** or **yarn** instead if you prefer; the scripts below are the same (`npm run dev`, and so on).

### Install dependencies

```bash
pnpm install
```

### Development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). If port 3000 is already in use, Next.js will pick the next free port (for example 3001) and print the URL in the terminal.

After a failed or interrupted dev session, clearing the cache can help:

```bash
rm -rf .next && pnpm dev
```

### Production build

```bash
pnpm build
pnpm start
```

`pnpm start` serves the optimized build (default port 3000 unless `PORT` is set).

### Lint

```bash
pnpm lint
```

### Demo accounts (mock users)

Sign in with any of the seeded users in `src/lib/mock-data/users-data.ts`, for example:

| Email               | Password    |
| ------------------- | ----------- |
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

### Routing and layouts

- **`/`** reads the `session` cookie in a server component and redirects to **`/servers`** when signed in, otherwise to **`/login`**.
- **Route groups** separate **`(auth)`** (login and signup) from **`(dashboard)`** (shell with header, navigation, and theme switcher).
- **Server detail** is **`/servers/[id]`**: an async server page resolves `params`, loads mock data, and calls **`notFound()`** for unknown IDs.

### Authentication (mock)

- **Server Actions** in `src/app/(auth)/_lib/auth-services.ts` implement login, signup, and logout. Credentials are checked against in-memory mock users; there is no real backend or database.
- **`AuthProvider`** (`src/context/auth-context.tsx`) calls **`/api/auth/me`** on mount so the header and account menu can show the current user on the client after hydration.

### Dashboard and data

- The **servers list** is a **client component** that filters, sorts, and debounces search over **`mockServers`** so the UI stays responsive without refetching.
- **Stats cards**, **filters**, and **cards** live under `src/app/(dashboard)/servers/_components/` as small, focused components.
- The **detail page** composes info panels, a chart over **`responseHistory`**, and a status timeline. **`getServerWithJitter`** (`src/lib/mock-data/servers-data.ts`) lightly varies numeric fields on each load so the detail view feels a little more “live” while still using mock data.

### UX and polish

- Loading routes use skeleton UI where it helps.
- Forms use accessible inputs (including a password field pattern) and show Zod and server validation errors inline.
- The **dashboard shell** centralizes header behavior, the account menu, and theme switching for a consistent layout across server views.
