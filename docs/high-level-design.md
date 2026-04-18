# High-Level Design

**Project:** Server Status Dashboard
**Author:** Mohamed Khadra
**Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, `next-themes`, `recharts`, `zod`.

## 1. Goals & Constraints
- Deliver a fast, accessible dashboard for scanning server fleet health and drilling into any single host.
- No real backend: all data is mocked in-process; auth is a cookie-based mock.
- Optimise for server-first rendering: protected redirects happen before HTML is sent; client hydration only where interactivity is needed (search, filter, theme, charts).
- Stay inside Next.js primitives (Server Components, Server Actions, Route Handlers, Proxy/Middleware) to minimise custom plumbing.

## 2. System Context (conceptual)

```
           ┌──────────────────────────────────────────────┐
 Browser ──┤  Next.js App (Server Components + Actions)   │── in-memory mock data
           │   ├─ Proxy (cookie check, redirects)         │       (users, servers)
           │   ├─ (auth) route group: /login, /signup     │
           │   ├─ (dashboard) group: /servers, /servers/[id] │
           │   └─ /api/auth/me (Route Handler)            │
           └──────────────────────────────────────────────┘
```

There is one runtime (the Next.js server) and one trust boundary (the `session` httpOnly cookie). No external network calls.

## 3. Routing & Rendering Strategy
- **Route groups** cleanly separate unauthenticated shells from the dashboard shell:
  - `src/app/(auth)/` — minimal layout wrapping `/login` and `/signup`.
  - `src/app/(dashboard)/` — shell with header, account menu, theme switcher, applied to `/servers` and `/servers/[id]`.
- **`src/app/page.tsx`** (server component) reads the `session` cookie and redirects to `/servers` or `/login`. This keeps the landing URL cheap and deterministic.
- **Server detail** `/servers/[id]/page.tsx` is an **async server component**: it awaits `params`, looks up the server, and calls `notFound()` on miss.
- **Loading UI:** each segment has a `loading.tsx` skeleton so navigation never looks frozen during data resolution.
- **Error UI:** `(dashboard)/error.tsx` isolates dashboard-scoped errors; unknown IDs fall through to `not-found.tsx`.

## 4. Authentication & Session
- **Credential check:** `src/app/(auth)/_lib/auth-services.ts` exposes `login`, `signup`, `logout` as **Server Actions**. `zod` schemas in `auth-validations.ts` validate FormData before any lookup.
- **Session issuance:** on success, a JSON payload (`{id, name, email}`) is written to an **httpOnly, SameSite=Lax** cookie named `session`, with `secure: true` in production and a 7-day max age.
- **Proxy/Middleware:** `src/proxy.ts` gates routing centrally:
  - `/servers/*` without `session` → redirect to `/login`.
  - `/login`/`/signup` with `session` → redirect to `/`.
  - Everything else → `NextResponse.next()`.
- **Client awareness:** `src/context/auth-context.tsx` (`AuthProvider`) fetches `/api/auth/me` on mount, so the header/account menu can render the current user on the client after hydration without leaking secrets into bundles.

## 5. Data Layer (mock)
- **`src/lib/mock-data/users-data.ts`** — seeded users (`admin@…`, `jane@…`, etc.). Signup pushes into the same array; persistence is process-lifetime only.
- **`src/lib/mock-data/servers-data.ts`** — seeded servers with identity, region, status, CPU, RAM, uptime, `responseHistory`, and status-change events. `getServerWithJitter()` adds small deterministic-ish variance to numeric fields on each detail load, giving the UI a "live" feel without timers or websockets.
- **Why arrays, not a store:** no cross-tab sync is needed; the assessment rubric emphasises Next.js fluency, not state-management patterns.

## 6. Component Architecture
- **Feature folders** under `src/app/(dashboard)/servers/_components/`:
  - `server-stats-cards.tsx` — aggregate counts.
  - `server-filters.tsx` — search + status/region filters; debounced.
  - `servers-list.tsx` — client component owning list state (search, filters, sort).
  - `server-card.tsx` — list row.
  - `server-detail-info.tsx`, `server-details-chart.tsx`, `server-status-timeline.tsx` — detail view panels.
- **Boundary policy:** list page is a server component that passes initial data to a client list for interactivity. Detail page is a pure server component composed from small, focused panels. This keeps the client bundle lean and the data-shaping logic on the server.
- **Helpers:** `_lib/server.helpers.ts` isolates pure transformations (aggregate counts, filter/sort predicates).

## 7. Styling, Theming & Accessibility
- **Tailwind v4** handles layout and tokens via `globals.css`. No custom CSS frameworks added on top.
- **`next-themes`** provides light/dark persistence with FOUT mitigation via the `suppressHydrationWarning` pattern on `<html>`.
- **A11y:** form inputs are labelled, password field follows a standard show/hide pattern, the account menu is keyboard-reachable, and status colors are paired with text so color is not the sole signal.

## 8. Security Considerations
- **httpOnly cookie** prevents JS access to session contents → mitigates XSS session theft.
- **`SameSite=Lax`** reduces CSRF risk for top-level navigation actions.
- **Server-side validation** with `zod` prevents bypassing client checks; server actions never trust client-parsed values.
- **Proxy** centralises redirect rules so a missing check in a page cannot leak protected content.
- **Acknowledged gaps (mock scope):** passwords stored in plain text in memory, no rate-limiting, no CSRF token on server actions (Next.js mitigates with origin checks, but a real deployment would add explicit defenses).

## 9. Performance Notes
- Server Components default keeps the client JS payload small (charts and the interactive list are the only sizeable client islands).
- Debounced search avoids re-render storms while typing.
- Skeletons plus `loading.tsx` give perceived-performance wins without actual blocking work.
- `recharts` is loaded only on the detail route, not on the list.

## 10. Extensibility
Planned seams for a real backend: (a) replace `mockServers` with a fetch from an API or a typed server function; (b) replace the in-memory user array with a DB + hashed passwords (argon2/bcrypt); (c) promote the `session` cookie payload to a signed JWT or opaque session ID; (d) add a websocket or polling layer for true live metrics behind the same component contracts — the UI would not need to change.
