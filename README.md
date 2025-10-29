## Pelanggaran FE

Frontend for a school violation management system built with Next.js (App Router) and TypeScript. It provides dashboards, student and class management, violation and violation-type workflows, image uploads, user management, and basic authentication.

### Key Features

- **Authentication**
  - Login via API; token stored in `localStorage` as `token`.
  - Axios attaches `Authorization: Bearer <token>`.
  - Auto-redirect to `'/login'` on `401`.
- **Dashboard**
  - Statistics and charts (Recharts).
  - Date range filtering; start date configurable via env.
- **Students**
  - List, detail, create, batch import, export.
- **Classes**
  - List, create, update, delete.
- **Violations**
  - List, detail, create, update, delete.
  - Image upload and preview.
- **Violation Types**
  - List, detail, create, batch import, update, delete.
- **Users**
  - List, create, update (self and admin), delete.
- **School Profile**
  - Logo, name, address; update flows.
- **Demo Mode**
  - Feature flag to run the app in demo/readonly-like contexts.

## Tech Stack

- **Next.js 15 (App Router)**, **React 18**, **TypeScript**
- **Tailwind CSS**, Radix UI primitives, Lucide icons
- **Axios** for HTTP, **ExcelJS** for import/export, **Recharts** for charts
- Utility libs: `date-fns`, `clsx`, `class-variance-authority`

## Getting Started

### Prerequisites

- Node.js 18.18+ (recommended LTS 20+)
- npm 9+ (or pnpm/yarn/bun if you prefer)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` at the project root:

```bash
# Base URL used by internal endpoint builder (src/config/config.ts + src/config/url.ts)
BASE_URL=http://localhost:8080

```
Notes:
- The code references both `BASE_URL` (for constructing endpoints in `src/config/url.ts`) and `NEXT_PUBLIC_API_BASE_URL` (for Axios base URL in `src/util/request.util.ts`). Make sure they point to the same backend unless you explicitly split them.
- If you change ports/domains, update CORS on the backend accordingly.

### Run

```bash
npm run dev
```

- App will be available at `http://localhost:3000`.

### Build and Start (Production)

```bash
npm run build
npm start
```

## Project Structure (selected)

- `src/app/`
  - `login/page.tsx`: login screen
  - `dashboard/`: main application pages
    - `page.tsx`: dashboard home
    - `student/`, `class-page/`, `violation/`, `violation-type/`, `user/`
    - nested `[slug]/page.tsx` for detail routes
  - `api/auth/get-cookie`, `api/auth/set-cookie`: api routes for cookie bridging if needed
- `src/components/` and `src/components/ui/`: shared UI components
- `src/user-components/`: feature components (students, violations, import/export, charts, pagination, search)
- `src/config/`
  - `config.ts`: reads `BASE_URL`
  - `url.ts`: central API endpoint map derived from `BASE_URL`
- `src/util/`
  - `request.util.ts`: Axios instance and interceptors, token injection, `logout()`
  - `util.ts`: helpers like `isDemo()`, `toTitleCase`, `truncateName`
- `src/middleware.ts`: (currently no route matching; add if you gate dashboard routes)

## API Integration

- Centralized endpoints in `src/config/url.ts`:
  - Students: create, list, detail, export, batch create
  - Violations and Violation Types: full CRUD, batch create for types
  - Images: upload, delete, list, detail
  - Users: create, list, detail, update, self-update, remove
  - Authentication: login, profile, me, logout, edit password
  - Dashboard: data, chart data
  - School Profile: data and updates
- Axios base URL: `NEXT_PUBLIC_API_BASE_URL`
- Authorization:
  - Token stored in `localStorage` key `token`
  - Request interceptor adds `Authorization: Bearer <token>`
  - Response interceptor redirects to `'/login'` on 401

## Authentication Notes

- The app uses a simple token strategy (not the `next-auth` flow), so ensure your backend returns a JWT or opaque token on login. Store it as `localStorage.setItem('token', <token>)` in the login flow.
- `logout()` clears the cookie `token` and navigates to `'/login'`. If you never set a cookie but rely purely on `localStorage`, it’s still safe, but you can adapt as needed.
- `src/middleware.ts` is currently a no-op. To protect dashboard routes at the edge, add a matcher and auth checks.

## Common Workflows

- **Import Students / Violation Types**
  - Use the import components in `src/user-components/student/*` and `src/user-components/violation-type/*`
  - ExcelJS handles the parsing; verify template columns match backend expectations.
- **Export Students / Violations**
  - Trigger export via UI; endpoints return file data for download.
- **Upload Violation Images**
  - Accessible from violation forms; images go through `ENDPOINT.UPLOAD_IMAGE`.

## Scripts

```bash
npm run dev     # Start dev server (Turbopack)
npm run build   # Build for production
npm start       # Start production server
npm run lint    # Lint
npm run format  # Prettier on src/**/*.ts
```

## Important Notes and Troubleshooting

- **401 Redirect Loop**
  - Ensure token is set in `localStorage` after login.
  - Backend CORS should allow the frontend origin.
  - Both `BASE_URL` and `NEXT_PUBLIC_API_BASE_URL` must be correct and reachable.
- **Inconsistent Base URLs**
  - If endpoints from `url.ts` and `axiosInstance` differ, you may hit different servers. Keep them aligned unless intentional.
- **Env Missing**
  - If `process.env.NEXT_PUBLIC_API_BASE_URL` is undefined, Axios requests will fail. Double-check `.env.local`.
- **SSR vs Browser**
  - Token/readers use `localStorage`; guard code with `typeof window !== 'undefined'` (already handled in the utilities).
- **Demo Mode**
  - Set `NEXT_PUBLIC_APP_DEMO=true` to enable demo behaviors in the UI.

## License

Proprietary/Internal. Update this section if you plan to open source.

## Acknowledgements

- Next.js, Tailwind CSS, Radix UI, Recharts, ExcelJS, Axios.