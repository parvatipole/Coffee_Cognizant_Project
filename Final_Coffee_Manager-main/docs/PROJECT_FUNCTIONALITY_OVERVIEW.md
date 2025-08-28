# CoffeeFlow – Functional & Architecture Overview (Concise)

This document describes how the system works end‑to‑end assuming a Spring Boot backend with MQTT for device communication and MySQL for persistence. It maps responsibilities, data flow, and where things live in this repository.

---

## 1) High‑Level Architecture
- Client (React SPA, Vite, TypeScript): UI/UX, routing, local caching, optimistic updates.
- Backend (Spring Boot): REST APIs, business rules, persistence to MySQL, MQTT integration.
- MQTT Broker: Real‑time telemetry from machines + command channel to devices.
- MySQL: Source of truth for machines, supplies, maintenance, alerts, users, sessions.

---

## 2) Frontend Responsibilities (this repo)
- Primary app: `client/` (SPA)
  - Routing: `client/App.tsx`, pages in `client/pages/` (e.g., Dashboard, MachineManagement, OfficeOverview, Login, NotFound)
  - UI components: `client/components/` + `client/components/ui/`
  - Contexts: `client/contexts/` (e.g., `AuthContext.tsx`)
  - Utilities/API: `client/lib/` (`api.ts` for backend calls, `dataManager.ts` for local persistence, `errorHandler.ts`, etc.)
  - Theme: `client/global.css`, Tailwind config in `tailwind.config.ts`
- Dev server (hybrid mode): `server/index.ts` exposes stub endpoints during dev; frontend auto‑switches to real backend when available.
- Standalone mock data (no backend):
  - Machines: `data/machines.json`
  - Config & defaults: `client/config/` (e.g., `machines.ts`, `ui-strings.ts`)

---

## 3) Backend Responsibilities (Spring Boot)
- REST API (consumed by frontend):
  - Auth: `POST /api/auth/signin`, `POST /api/auth/signup`, `POST /api/auth/signout`
  - Machines: `GET /api/machines`, `GET /api/machines/:id`, `GET /api/machines/machine/:machineId`, `PUT /api/machines/:id`, `PUT /api/machines/:id/supplies`
  - Location/Monitoring: `GET /api/machines/locations`, `GET /api/machines/offices?location=...`, `GET /api/machines/floors?...`, `GET /api/machines/by-location-office-floor?...`, `GET /api/machines/low-supplies?threshold=...`, `GET /api/machines/maintenance-needed`
- Services: Implements rules (low‑supply alerts, electricity status, maintenance reminders, usage trends)
- Repositories (JPA): CRUD for MySQL tables (Machines, Supplies/Usage, Alerts, Refills, Maintenance, Users/Sessions)
- MQTT Integration: Subscribes to telemetry topics; publishes commands; normalizes and persists incoming events.

---

## 4) MQTT Topics & Payloads (typical)
- Telemetry (device -> backend): `coffee/machines/{machineId}/telemetry`
  - Example payload:
    ```json
    {
      "machineId": "M-001",
      "status": "operational",
      "powerStatus": "online",
      "electricityStatus": "available",
      "supplies": { "water": 82, "milk": 64, "coffee": 55, "sugar": 41 },
      "maintenance": { "filterStatus": "good", "cleaningStatus": "clean", "pressure": 9.8 },
      "usage": { "dailyCups": 42, "weeklyCups": 210 },
      "timestamp": "2025-08-28T12:00:00Z"
    }
    ```
- Commands (backend -> device): `coffee/machines/{machineId}/command`
  - Example payload: `{ "type": "REFILL_REQUEST", "note": "Top up sugar to 100%" }`
- Ack/Errors (device -> backend): `coffee/machines/{machineId}/ack` / `.../error`
- Retained last‑known state on telemetry topic to bootstrap dashboards quickly.

---

## 5) MySQL Data Model (core tables)
- machines
  - id (PK, UUID), machine_id (UNIQUE), name, location, office, floor,
    status ENUM('operational','maintenance','offline'), power_status ENUM('online','offline'),
    electricity_status ENUM('available','unavailable'), last_power_update DATETIME,
    notes TEXT, created_at, updated_at
- machine_supplies (latest snapshot)
  - id (PK), machine_id (FK -> machines), water TINYINT, milk TINYINT, coffee TINYINT, sugar TINYINT, updated_at
- maintenance_status
  - id (PK), machine_id (FK), filter_status ENUM('good','needs_replacement','critical'),
    cleaning_status ENUM('clean','needs_cleaning','overdue'), pressure DECIMAL(4,1), updated_at
- usage_counters
  - id (PK), machine_id (FK), daily_cups INT, weekly_cups INT, updated_at
- refills
  - id (PK), machine_id (FK), item ENUM('water','milk','coffee','sugar'), amount TINYINT, performed_by VARCHAR(100), created_at
- alerts
  - id (PK), machine_id (FK), type ENUM('LOW_SUPPLY','POWER_OFF','ELECTRICITY_UNAVAILABLE','MAINTENANCE_DUE'),
    severity ENUM('info','warning','critical'), message VARCHAR(255), resolved BOOLEAN, created_at, resolved_at
- users
  - id (PK), username (UNIQUE), password_hash, role ENUM('admin','technician','viewer'), created_at, updated_at
- sessions (optional if JWT not used)
  - id (PK), user_id (FK), token, expires_at, created_at

Note: In standalone mode only, machine data resides at `data/machines.json`; in integrated mode, MySQL is the source of truth and the file is unused.

---

## 6) Functional Breakdown (point‑wise)
- Authentication
  - Frontend: `client/contexts/AuthContext.tsx` manages session state; UI at `client/pages/Login.tsx`.
  - Backend: Validates credentials, issues JWT/session; protects API routes.
- Machine Directory & Details
  - Frontend pages: `client/pages/Dashboard.tsx`, `client/pages/MachineManagement.tsx`, `client/pages/OfficeOverview.tsx`, `client/pages/CorporateDashboard.tsx`.
  - Backend: `/api/machines*` endpoints return lists, detail, and filtered queries (by location/office/floor).
- Real‑time Status & Telemetry
  - Devices publish telemetry via MQTT; backend persists into MySQL and refreshes computed fields.
  - Frontend polls REST endpoints (or can subscribe via SSE/WebSocket if added) and merges with local cache (`client/lib/dataManager.ts`).
- Supply Tracking & Refills
  - Frontend: edit/refill flows (e.g., `client/components/AddMachineModal.tsx`, `client/components/DeleteMachineDialog.tsx`).
  - Backend: `PUT /api/machines/:id/supplies` updates snapshot; creates `refills` entries; can publish command to device.
- Alerts & Notifications
  - Backend rules: supplies < 20%, electricity unavailable, maintenance due → write `alerts` rows.
  - Frontend UI: `client/components/FloatingAlertNotification.tsx`, `client/components/AlertManagement.tsx`, plus toasts in `client/components/ui/toast.tsx`.
- Maintenance & Health
  - Backend computes maintenance flags from telemetry; exposes `GET /api/machines/maintenance-needed`.
  - Frontend shows status badges (Tailwind + Radix UI) and maintenance views.
- Analytics & Reporting
  - Backend aggregates from `usage_counters`, `refills`, `alerts`.
  - Frontend charts: `client/components/BrewTypeAnalytics.tsx`, `recharts` usage with helpers in `client/lib/rechartsSuppress.ts`.

---

## 7) Data Flow (end‑to‑end)
1) Device → MQTT telemetry.
2) Backend MQTT listener → validates, normalizes, persists to MySQL; evaluates rules; writes alerts; updates snapshots.
3) Frontend → `client/lib/api.ts` calls REST endpoints; merges with local cache via `client/lib/dataManager.ts` for snappy UX/offline.
4) User actions (edits/refills) → REST `PUT` → Backend updates DB; optionally publishes MQTT command; responses update UI state.

---

## 8) Configuration & Environments
- Frontend env (examples):
  - `VITE_STANDALONE_MODE`, `VITE_API_BASE_URL`, `VITE_DEBUG`, `VITE_APP_NAME`, `VITE_APP_VERSION`
  - Theme tokens in `client/global.css`; Tailwind in `tailwind.config.ts`
- Backend env (examples):
  - `SPRING_DATASOURCE_*` (MySQL), `SPRING_JPA_*`, MQTT broker URL/creds, JWT secret, CORS origins.

---

## 9) Ownership (“who manages what”)
- Frontend: UI state, navigation, local caching, validation, optimistic updates, error toasts.
- Backend: Business logic, persistence, authorization, alert rules, integration with devices via MQTT.
- MQTT Broker: Transport for telemetry/commands; retained state for quick bootstrapping.
- MySQL: Durable system of record; supports analytics and reporting.

---

## 10) Key Files & Directories (this repo)
- SPA app shell: `client/App.tsx`
- Pages: `client/pages/`
- UI library: `client/components/ui/`
- Domain components: `client/components/`
- State & APIs: `client/contexts/`, `client/lib/`
- Standalone mock data: `data/machines.json`
- Dev server (stubs): `server/index.ts`
- Tailwind theme: `client/global.css`, `tailwind.config.ts`
- Backend placeholder module: `backend-java/` (Spring Boot project; backend implementation assumed here)

---

## 11) Error Handling & Resilience
- Frontend: retries/backoff in `client/lib/api.ts`, global error UI in `client/components/ErrorBoundary.tsx`, graceful fallbacks to local cache.
- Backend: input validation, schema constraints, idempotent updates, deduplication of telemetry by (machineId,timestamp), and dead‑letter handling for MQTT if configured.

---

This setup enables independent frontend development (standalone mode) while supporting seamless integration with a real Spring Boot + MQTT + MySQL backend for production.
