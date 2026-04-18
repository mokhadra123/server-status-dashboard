# User Stories & Critical User Journeys

**Project:** Server Status Dashboard
**Author:** Mohamed Khadra
**Scope:** Next.js dashboard for browsing mock servers, inspecting metrics, and signing in with a mock auth flow.

## 1. Personas

- **Ops Engineer (primary):** monitors fleet health, needs a fast scan of server status plus quick drill-down into any anomaly.
- **Team Lead (secondary):** occasional viewer, cares about high-level counts (online / degraded / offline) and recent history of a specific server.
- **New Teammate:** signs up with a demo account, expects an obvious path from landing → list → detail.

## 2. User Stories

### 2.1 Authentication
- **US-A1 — Sign in with existing credentials.** *As* a returning user, *I want* to log in with my email and password *so that* I reach the dashboard and my session is remembered across reloads.
  - **Acceptance:** valid credentials set an httpOnly `session` cookie and redirect to `/servers`; invalid credentials render an inline error without a full page reload; Zod validates email format and password presence before submit.
- **US-A2 — Create a mock account.** *As* a new user, *I want* to sign up with name, email, password *so that* I can explore the app without shared credentials.
  - **Acceptance:** duplicate email is rejected with a readable message; successful signup auto-signs-in and lands on `/servers`.
- **US-A3 — Sign out.** *As* any authenticated user, *I want* a visible "Log out" action in the header account menu *so that* I can end my session on a shared machine.
  - **Acceptance:** logout deletes the cookie and redirects to `/login`; protected routes become inaccessible afterwards.
- **US-A4 — Route protection.** *As* the system owner, *I want* unauthenticated requests to `/servers/*` redirected to `/login`, and authenticated requests to `/login` or `/signup` redirected away *so that* state never desyncs with the URL.

### 2.2 Server List
- **US-L1 — Scan fleet health at a glance.** *As* an Ops Engineer, *I want* stat cards showing totals for *online*, *degraded*, and *offline* servers *so that* I can assess health within two seconds of landing.
- **US-L2 — Find a server by name or region.** *As* an Ops Engineer, *I want* a debounced search box and status/region filters *so that* I can locate a specific server without scrolling.
  - **Acceptance:** typing does not block the UI; filters combine (AND) with search; clearing restores the full list.
- **US-L3 — Sort the list.** *As* a user, *I want* to sort by name, status, or response time *so that* I can prioritize what I review first.

### 2.3 Server Detail
- **US-D1 — Inspect a single server.** *As* an Ops Engineer, *I want* `/servers/[id]` to show identity, region, uptime, CPU/RAM, and last-checked timestamp *so that* I can diagnose a hot host.
- **US-D2 — See response-time history.** *As* a Team Lead, *I want* a line chart of the last N response-time samples *so that* I can see whether the server is trending worse.
- **US-D3 — See status timeline.** *As* an Ops Engineer, *I want* a chronological list of recent status changes *so that* I can correlate incidents with deploys.
- **US-D4 — Handle unknown IDs.** *As* the system, *I want* unknown `[id]` values to render a 404 via `notFound()` *so that* deep links fail loudly and safely.

### 2.4 Cross-cutting
- **US-X1 — Theme switch.** Persisted light/dark toggle; avoids flash-of-wrong-theme on first paint.
- **US-X2 — Loading states.** Each route shows a skeleton so navigation never looks frozen.
- **US-X3 — Accessibility.** Labelled inputs, keyboard-reachable account menu, sufficient color contrast in both themes.
- **US-X4 — Responsive layout.** Usable from ~360 px up; grid collapses to one column on mobile.

## 3. Critical User Journeys

### CUJ-1 — First-time user → dashboard
1. User opens `/`. Server component reads the `session` cookie; absent → redirects to `/login`.
2. User clicks **Sign up**, fills the form; Zod validates client-side, the server action re-validates and rejects duplicate emails.
3. On success, a `session` cookie is set and the user is redirected to `/servers`.
4. Stat cards, filters, and the server grid render from `mockServers`. The account menu in the header shows the new user's name (fetched via `/api/auth/me` after hydration).
- **Success criteria:** < 3 steps from landing to signed-in dashboard; no dead ends on validation errors.

### CUJ-2 — Returning user → diagnose a degraded server
1. User lands on `/`, cookie present → redirected to `/servers`.
2. User scans stat cards, notices the *degraded* count is non-zero.
3. User filters by **status = degraded**, sorts by **response time desc**, clicks the top row.
4. Detail page (`/servers/[id]`) renders identity panel, response-time chart, and status timeline. `getServerWithJitter` lightly varies numeric fields so the view feels live.
5. User reviews the chart trend and recent status changes, then uses the back link to return to the list with filters preserved.
- **Success criteria:** ≤ 4 clicks from landing to actionable detail; filters persist across navigation.

### CUJ-3 — Session expiry & safe recovery
1. User is on `/servers/[id]`; cookie is cleared (logout in another tab, or manual).
2. Next navigation hits the proxy (`src/proxy.ts`), which detects missing session on a protected route and redirects to `/login`.
3. After re-login, user is returned to `/servers`.
- **Success criteria:** no protected data is shown without a valid cookie; redirect loops are impossible because `/login` is explicitly public.

### CUJ-4 — Direct deep link to an unknown server
1. User pastes `/servers/does-not-exist`.
2. Server page resolves `params`, fails the lookup, calls `notFound()`.
3. Next.js renders the 404 boundary; header/theme remain intact.
- **Success criteria:** deep links never render an empty shell or a broken chart.

## 4. Out of Scope (for this iteration)
Real backend, real metrics ingestion, alerting/paging, role-based permissions, multi-tenant isolation, and persistence of signup data beyond the running process. These are acknowledged as natural next steps but intentionally excluded to keep the assessment focused on the UX and the Next.js architecture.
