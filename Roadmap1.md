# Beach Cache Detection & Coordination – Roadmap (Supabase Edition)

Monorepo roadmap for building the **Beach Cache Detection & Coordination System** with Cline.

Backend platform: **Supabase (Postgres, Auth, Realtime, Storage)**  
Service backend: **FastAPI on Linode** for AI + email + orchestration.

Vibe: **Year 2100 / Futuristic / Active Team Ops**
- Dark, tactical UI with neon accents.
- Fast, map-centric, operator-style workflows.

---

## Development & Deployment Workflow

### Local to Production Process

**1. Local Development (Your PC)**
- Make code changes locally
- Run local tests to verify:
  - Backend: `cd backend && uvicorn app.main:app --reload`
  - Web Dashboard: `cd web-dashboard && npm run dev`
  - Mobile: `cd mobile && npm start`
- **Important:** Run `npm install` in web-dashboard whenever package.json changes to update package-lock.json
- Commit and push changes:
  ```bash
  git add .
  git commit -m "Your descriptive message"
  git push origin master
  ```

**2. Deployment to Linode Server**
- SSH into your Linode server
- Pull latest changes: `cd ~/unknown && git pull origin master`
- Build and run Docker containers: `docker-compose up -d --build`
- Verify: `docker-compose ps`

### Key Guidelines

1. **Package Management:**
   - Always update package-lock.json locally when changing package.json
   - Run `npm install` before committing dependency changes

2. **Docker Build Process:**
   - Dockerfiles handle installation and building
   - Web dashboard uses `npm install` in Dockerfile to ensure dependencies resolve

3. **Code Transfer:**
   - All code transfers via Git: Local → GitHub → Linode
   - No need for direct file transfers

4. **Environment Configuration:**
   - Local: Use .env files for development
   - Production: Configure via docker-compose.yml or mounted .env file

---

## 0. Tech & Design Assumptions

### Monorepo structure

- `/backend` – FastAPI (Python) service, talking to Supabase (DB) + OpenAI + SMTP.
- `/web-dashboard` – React + Vite + TypeScript + Tailwind, using `@supabase/supabase-js`.
- `/mobile` – Expo React Native + TypeScript + `@supabase/supabase-js`.

### Supabase

Create a Supabase project with:

- **Auth** – email/password or phone-based login for vetted volunteers.
- **Database** – Postgres with our domain tables.
- **Storage** – Bucket for cache photos.
- **Realtime** – Enabled on relevant tables (cache reports, SOS, patrol points/incidents).

Environment variables (root-level and app-specific):

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY` (for frontends)
- `SUPABASE_SERVICE_ROLE_KEY` (backend only, NEVER in frontends)
- `OPENAI_API_KEY` (backend only)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- `AUTHORITY_EMAIL_TO` (test value at first)
- `MAP_API_KEY`
- `BACKEND_BASE_URL` (for web + mobile to call FastAPI)

### Design system – "2100 Active Team"

- **Mode**: Dark by default

Palette (Tailwind style):

- Background: `#020617` / `#050816`
- Panels: `#0f172a`, borders `#1e293b`
- Primary: Neon cyan `#22d3ee`
- Accent 1: Neon magenta `#e879f9`
- Accent 2: Electric lime `#a3e635`
- Danger: `#f97373`
- Text primary: `#e5e7eb`, muted: `#9ca3af`

Fonts:

- Headings: `"Orbitron"` or `"Space Grotesk"`
- Body: `"Inter"` or `"SF Pro Text"`

UI feel:

- Rounded cards (`rounded-2xl`), glass panels (`bg-slate-900/70`, `backdrop-blur`).
- Subtle neon glows on primary actions.
- Map-first layouts with side panels for lists & filters.

---

## Build Stages (Overview)

1. **Stage 1 – Supabase Setup, Project Skeleton & Design System**
2. **Stage 2 – Supabase Schema & RLS: Volunteers, Patrols, Cache Reports, SOS**
3. **Stage 3 – Web Dashboard v1: Supabase Auth, Map, Cache List (Realtime)**
4. **Stage 4 – Mobile App v1: Supabase Auth, Patrol Mode, Basic Cache Reporting**
5. **Stage 5 – SOS, Notifications & Coverage Visualisation**
6. **Stage 6 – FastAPI Service: Authority Email & Protected Operations**
7. **Stage 7 – AI Integration (OpenAI Summaries via FastAPI)**
8. **Stage 8 – Analytics, Risk & Final UI Polish**

Cline should work through these stages **in order**.

---

## Stage 1 – Supabase Setup, Project Skeleton & Design System

### Goals

- Create Supabase project.
- Create monorepo structure.
- Implement 2100-style design shell for web and mobile.

### Tasks

**1.1 Supabase project**

- Create a new Supabase project.
- Note `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
- Create a **bucket** in Storage for cache photos, e.g. `cache-photos`.

**1.2 Monorepo layout**

- Root files:
  - `roadmap1.md` (this file)
  - `README.md`
  - `.gitignore`
- Folders:
  - `/backend`
  - `/web-dashboard`
  - `/mobile`

**1.3 Backend skeleton (`/backend`)**

- FastAPI app with:
  - `GET /health` returning `{ "status": "ok" }`.
- Python dependency manager (Poetry or requirements.txt).
- Config module reading:
  - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
  - `OPENAI_API_KEY`, `SMTP_*`, `AUTHORITY_EMAIL_TO`

_No DB migrations here – schema will live in Supabase directly._

**1.4 Web dashboard skeleton (`/web-dashboard`)**

- Vite + React + TypeScript + Tailwind.
- Add `@supabase/supabase-js`.
- Configure Tailwind with the 2100 palette and fonts.
- Create:
  - `SupabaseClient` file (singleton using `SUPABASE_URL` + `SUPABASE_ANON_KEY`).
  - Basic layout:
    - Left nav rail (icons).
    - Top bar with logo/title.
    - Main map area placeholder with future neon look.

**1.5 Mobile skeleton (`/mobile`)**

- Expo React Native app with TypeScript.
- Add `@supabase/supabase-js` & basic Supabase client.
- Screens:
  - `Login`, `Patrol`, `Report`, `Settings`.
- Apply dark theme with neon accents.

### Acceptance checklist

- [ ] Supabase project exists.
- [ ] Web + mobile can import a Supabase client (even if not used yet).
- [ ] Web shows a dark, futuristic shell with mock map area.
- [ ] Mobile launches with themed home screen.

---

## Stage 2 – Supabase Schema & RLS

### Goals

- Define all tables in Supabase.
- Add basic Row Level Security (RLS) policies aligned with roles.

### Tasks

**2.1 Schema (SQL)**

In Supabase SQL editor or via migrations, create tables:

- `roles` (optional lookup) or use enum type.
- `volunteers`  
  - `id uuid (PK, references auth.users.id)`
  - `nickname text`
  - `phone text`
  - `role text` (`boat_finder`, `leader`, `analyst`, `liaison`, `admin`)
  - `status text` (`active`, `inactive`)
  - `created_at timestamptz`
  - `last_login_at timestamptz`
- `patrol_sessions`  
  - `id uuid PK`
  - `volunteer_id uuid references volunteers(id)`
  - `started_at timestamptz`
  - `ended_at timestamptz`
  - `status text` (`active`, `stopped`)
- `patrol_points`  
  - `id uuid PK`
  - `patrol_session_id uuid references patrol_sessions(id)`
  - `lat double precision`
  - `lng double precision`
  - `recorded_at timestamptz`
- `cache_reports`  
  - `id uuid PK`
  - `reporter_id uuid references volunteers(id)`
  - `lat double precision`
  - `lng double precision`
  - `created_at timestamptz`
  - `cache_type text`
  - `hiding_method text`
  - `readiness text`
  - `urgency text`
  - `notes text`
  - `status text`
  - `incident_id uuid nullable`
- `incidents`  
  - `id uuid PK`
  - `created_at timestamptz`
  - `region_id text`
  - `status text`
  - `risk_level text`
  - `summary_ai text`
  - `authority_email_sent_at timestamptz`
- `sos_events`  
  - `id uuid PK`
  - `requester_id uuid references volunteers(id)`
  - `lat double precision`
  - `lng double precision`
  - `created_at timestamptz`
  - `status text`
  - `reason_text text`
  - `resolved_at timestamptz`
- `region_segments`  
  - `id uuid PK`
  - `name text`
  - `polygon_geojson jsonb`
- `audit_logs`  
  - `id uuid PK`
  - `actor_id uuid`
  - `action_type text`
  - `target_type text`
  - `target_id uuid`
  - `timestamp timestamptz`
  - `metadata jsonb`

Note: media paths will live in Storage, not in a table for now, or optionally in a simple `cache_report_photos` table referencing storage paths.

**2.2 Enable RLS and basic policies**

- Enable RLS on core tables (`volunteers`, `patrol_sessions`, `patrol_points`, `cache_reports`, `sos_events`, `incidents`).
- Add policies like:
  - Volunteers can **see and update only their own** profile row.
  - Boat finders:
    - can insert `patrol_sessions`, `patrol_points`, `cache_reports`, `sos_events` where `volunteer_id = auth.uid()` (via FK).
  - Leaders/Analysts/Liaison:
    - can read all `cache_reports`, `incidents`, `sos_events`.
- Use Supabase Auth's `auth.uid()` in policies.

**2.3 Realtime**

- Enable Realtime on:
  - `cache_reports`
  - `incidents`
  - `sos_events`
  - Optionally `patrol_points` (but we may aggregate later to reduce noise).

### Acceptance checklist

- [ ] All core tables exist in Supabase.
- [ ] RLS enabled and basic policies for boat_finder vs leader are working.
- [ ] Realtime enabled on main tables.

---

## Stage 3 – Web Dashboard v1: Supabase Auth, Map, Cache List (Realtime)

### Goals

- Web dashboard uses Supabase Auth for sign-in.
- Displays map with live cache reports via Supabase queries + Realtime.

### Tasks

**3.1 Supabase Auth integration (web)**

- Implement login with email/password (or magic link if preferred).
- On login:
  - Use `supabase.auth.signInWithPassword` or equivalent.
  - Store session via Supabase client (automatic).
- Protect routes:
  - If no user, show login.
  - If user, show dashboard.

**3.2 Fetch and display cache reports**

- On dashboard load:
  - Query `cache_reports` joined with `volunteers` (for nickname).
- Render markers on map:
  - Colour-coded by `urgency` or `status`.
- List view:
  - Table or list panel with: date, type, readiness, urgency, reporter nickname.

**3.3 Realtime subscription**

- Subscribe to `cache_reports` Realtime changes:
  - On insert: add marker & list item.
  - On update: update marker/list.
- Optional: simple "toaster" or neon pulse when new report arrives.

**3.4 Futuristic styling**

- Implement:
  - Dark background, neon cyan primary.
  - Orbitron headings, Inter text.
  - Map container as a "holographic" card with subtle border glows.

### Acceptance checklist

- [ ] Web login works via Supabase.
- [ ] Cache reports appear on map + list.
- [ ] Creating a new cache report directly in Supabase shows up live in web via Realtime.

---

## Stage 4 – Mobile App v1: Supabase Auth, Patrol Mode, Basic Cache Reporting

### Goals

- Volunteers log in on mobile via Supabase Auth.
- They can start patrol mode (tracking points) and create cache reports.

### Tasks

**4.1 Supabase Auth (mobile)**

- Use `@supabase/supabase-js` with Expo.
- Implement login screen calling `supabase.auth.signInWithPassword` (or chosen method).
- Store session so user stays logged in between app opens.

**4.2 Patrol mode**

- `Patrol` screen:
  - "Start patrol" button:
    - Creates `patrol_sessions` row in Supabase (`status="active"`).
  - While active:
    - Poll device location at low frequency (e.g. 30–60s).
    - **Optimization:** Batch collected GPS points and send every 3-5 minutes to reduce network traffic and server load.
    - Insert `patrol_points` into Supabase.
  - "Stop patrol":
    - Update `patrol_sessions` with `ended_at` + `status="stopped"`.
  - **Emergency override:** During SOS events, switch to immediate transmission of location points.

**4.3 Cache report creation**

- `Report` screen:
  - Use current GPS position.
  - Form fields:
    - `cache_type`, `hiding_method`, `readiness`, `urgency`, `notes`.
  - Insert row into `cache_reports` with `reporter_id = current volunteer`.

**4.4 Basic Supabase Storage integration**

- For this stage, optionally:
  - Allow attaching a single photo.
  - Use Supabase Storage bucket `cache-photos`.
  - Store the storage path in a simple `cache_report_photos` table.

### Acceptance checklist

- [ ] Mobile logs in via Supabase.
- [ ] Starting and stopping patrols creates data in Supabase.
- [ ] Creating cache reports from mobile shows them on web dashboard.

---

## Stage 5 – SOS, Notifications & Coverage Visualisation

### Goals

- SOS flow works end-to-end (mobile → Supabase → web via Realtime).
- Basic push notification wiring is ready.
- Dashboard shows patrol coverage (last patrolled per segment).

### Tasks

**5.1 SOS on mobile**

- Add big SOS button.
- On press:
  - Insert row into `sos_events` with current location, reason text, status `active`.

**5.2 SOS Realtime on web**

- Web subscribes to `sos_events`.
- When a new `active` SOS arrives:
  - Show marker on map with distinct colour.
  - Show SOS in sidebar list ("open SOS events").

**5.3 Push notifications (scaffolding)**

- On mobile:
  - Register device for push notifications (Expo Notifications).
  - Store device token in a Supabase table `volunteer_devices`.
- For now, just ensure:
  - Tokens are stored,
  - A placeholder FastAPI or script can send push to those tokens later.

**5.4 Coverage aggregation (server-side or Supabase function)**

- Option A (simple for now):
  - Use SQL view or function to compute for each `region_segment`:
    - `last_patrolled_at` (max `recorded_at` from `patrol_points` in segment).
- Web dashboard:
  - Call RPC or view to get `region_segments` + coverage metadata.
  - Overlay segments on map with colours based on `last_patrolled_at`.

**5.5 Boat Finder Location Tracking for Leaders**

- Web dashboard for leaders:
  - Display active boat finder locations on map with distinct markers showing:
    - Current position (most recent patrol point)
    - Volunteer nickname/identifier
    - Status indicator (active/idle)
  - Option to view patrol history/trails for each boat finder
  - Filter controls to show/hide specific volunteers or patrol sessions
- Realtime updates:
  - Subscribe to `patrol_points` changes with Supabase Realtime
  - Update boat finder positions as new batched points arrive
  - Leaders can trigger "request current position" for specific volunteers if needed

### Acceptance checklist

- [ ] Creating SOS from mobile shows up in web in real time.
- [ ] Basic push tokens stored per volunteer.
- [ ] Coverage view shows which segments were patrolled recently vs not.

---

## Stage 6 – FastAPI Service: Authority Email & Protected Operations

### Goals

- Introduce FastAPI as a service backend for:
  - Authority email notifications.
  - Any logic that must use service role key or external APIs.

### Tasks

**6.1 Supabase service access (backend)**

- In `/backend`:
  - Use `SUPABASE_SERVICE_ROLE_KEY` and `SUPABASE_URL` to:
    - Query incidents and related cache reports from Supabase.
    - Option: use `supabase-py` or direct Postgres connection with psycopg2.

**6.2 Incident & email flow (backend)**

- FastAPI endpoints (backend only, not public to internet unless behind auth):
  - `POST /incidents/{id}/notify-authority`
- Logic:
  - Read incident + cache reports from Supabase.
  - Compose email body.
  - Send email via SMTP to `AUTHORITY_EMAIL_TO`.
  - Update `incidents.authority_email_sent_at`.

**6.3 Web integration**

- From web dashboard:
  - Add button "Notify French police" on incident detail.
  - Clicking calls FastAPI endpoint.
  - Once successful, reload incident data from Supabase.

**6.4 Auth between web and backend**

- Option A: assume backend sits behind trusted network; use simple API key header.  
- Option B (nicer): send Supabase JWT to backend and verify it, then enforce only `leader` or `admin` can trigger `notify-authority`.

### Acceptance checklist

- [ ] FastAPI can read Supabase data using service key.
- [ ] Clicking "Notify authority" from web sends a real email (to test address).
- [ ] Incident row in Supabase gets updated with `authority_email_sent_at`.

---

## Stage 7 – AI Integration (OpenAI Summaries via FastAPI)

### Goals

- Use OpenAI via FastAPI to:
  - Summarise incidents.
  - Generate activity briefings.

### Tasks

**7.1 AI service in backend**

- In `/backend`, create module (e.g. `ai_service.py`) with functions:
  - `summarise_incident(incident, cache_reports, region_context, weather_context)`
  - `summarise_activity(incidents, cache_reports, time_range, region)`
- Use `OPENAI_API_KEY`.
- Prompt rules:
  - Never tell volunteers to confront migrants or smugglers.
  - Summaries must focus on **hidden boats/equipment**, patrol patterns, and recommendation to notify authorities.

**7.2 Summarise incident endpoint**

- `POST /incidents/{id}/generate-summary`
- Backend:
  - Fetch incident + related cache reports from Supabase.
  - Call OpenAI via `ai_service`.
  - Write summary back to `incidents.summary_ai` in Supabase.

**7.3 Web integration**

- Add button "Generate AI summary" in incident detail panel.
- Display `summary_ai` as a neon-highlighted panel in UI.

**7.4 Activity summary**

- Endpoint: `POST /analytics/ai-summary`
  - Receives time range + region.
  - Fetches incidents from Supabase.
  - Uses OpenAI to produce briefing.
- Web Analytics page:
  - Query endpoint and show AI briefing text.

### Acceptance checklist

- [ ] AI summary can be generated for an incident and saved in Supabase.
- [ ] Web dashboard shows the AI summary clearly.
- [ ] No PII (phone numbers etc.) are sent to OpenAI.

---

## Stage 8 – Analytics, Risk & Final UI Polish

### Goals

- Add simple risk scores & analytics.
- Polish UI into a cohesive year-2100 ops console.
- Add basic export capabilities.

### Tasks

**8.1 Risk scoring (optional)**

- Add table `risk_snapshots` (if needed) or calculate on the fly:
  - Risk per `region_segment` based on:
    - Cache density in last X days.
    - Patrol coverage (gaps).
- Show risk overlay on the map (neon heatmap).

**8.2 Analytics views**

- Charts (web:
  - Caches per day/week.
  - Caches per segment.
  - Patrol hours per segment.
- Filters:
  - Time range, cache type, region.

**8.3 UI polish**

- Smooth transitions, skeleton loaders.
- Clear focus/hover states with neon glows.
- Consistent iconography for:
  - Patrol, Cache, SOS, Risk.

**8.4 Export/report**

- Simple "Download CSV" of cache_reports/incidents for a given period via Supabase query.
- Optionally, have backend generate a PDF or text report using AI summary + charts.

### Acceptance checklist

- [ ] Risk view and analytics charts use live data from Supabase.
- [ ] UI feels cohesive, responsive, and "2100 active team".
- [ ] Data export works for basic reporting.

---

## How Cline Should Use This Roadmap

1. Follow stages **in order**, updating `/backend`, `/web-dashboard`, and `/mobile` as described.
2. At each stage:
   - Implement tasks.
   - Verify against the Acceptance checklist.
3. Always use:
   - **Supabase** for Auth, DB, Realtime, Storage.
   - **FastAPI** for OpenAI + email + protected operations.
4. Keep the **"year 2100 team ops"** aesthetic consistent across web + mobile.

---

## Performance & Scaling Considerations

When scaling this application to handle up to 5000 mobile devices, consider these optimizations:

### Server-Side Optimizations

1. **Database Scaling**:
   - Leverage Supabase's built-in PostgreSQL scalability
   - Use proper indexing on frequently queried columns (lat, lng, timestamps)
   - Consider implementing database partitioning for historical data

2. **API Layer Performance**:
   - Deploy FastAPI behind a load balancer on Linode
   - Implement connection pooling for database connections
   - Add request rate limiting to prevent API abuse
   - Use response caching for frequently accessed, slowly-changing data

3. **Realtime Efficiency**:
   - Enable selective subscriptions (subscribe only to needed channels)
   - Implement proper error handling and reconnection strategies
   - Consider limiting Realtime updates to critical data (e.g., SOS events always, patrol points less frequently)

### Mobile Client Optimizations

1. **Data Transmission**:
   - Implement batched updates for patrol points as specified in section 4.2
   - Use local caching to reduce redundant API requests
   - Compress data before transmission
   - Implement smart retry mechanisms with exponential backoff

2. **Background Processing**:
   - Optimize background location tracking to minimize battery drain
   - Queue updates when offline for later transmission
   - Prioritize critical events (SOS) over routine updates

### Map Performance

1. **Map Rendering**:
   - Use map clustering for dense collections of markers
   - Load only markers in the current viewport
   - Implement virtual rendering for long lists of cache reports
   - Consider using vector tiles for efficient map rendering

2. **Asset Loading**:
   - Serve map assets via CDN
   - Implement proper asset caching strategies
   - Lazy-load non-critical components and data

### Deployment Architecture

1. **Auto-scaling**:
   - Configure Linode for horizontal scaling based on load
   - Set up proper monitoring and alerting
   - Implement graceful degradation strategies for peak loads

2. **Testing Under Load**:
   - Conduct regular load testing with simulated clients
   - Monitor database query performance
   - Test Realtime message delivery under heavy load

By implementing these optimizations, the system should comfortably handle 5000 mobile devices while maintaining responsive performance and a good user experience.
