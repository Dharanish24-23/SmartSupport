# SmartSupport — Smart Financial Support Scheme Eligibility System

A full-stack demo application that helps users discover financial support schemes
(government/NGO) they may be eligible for, based on their personal, financial,
medical, and document information — with transparent, reason-by-reason eligibility
explanations, application submission, and tracking.

> **Note:** All schemes, organizations, and amounts included as sample data are
> **demo/sample data only** and do not represent real government or NGO programs.

---

## 1. Project Overview

SmartSupport lets a user:

- Register / log in
- Fill out a multi-step eligibility questionnaire (personal, financial, medical, documents)
- See a ranked list of schemes with a weighted **match score**, clear ✓/✗ **reasons**,
  and the **maximum financial support** available
- Browse and search all schemes, with filters
- Apply to a scheme and receive a unique application ID (e.g. `APP-2026-000001`)
- Track application status through a visual timeline (Submitted → Verification → Under
  Review → Approved/Rejected)
- Upload supporting documents (PDF/JPG/JPEG/PNG, max 5MB)

Admins can:

- View platform-wide stats (users, schemes, applications by status)
- Create / edit / delete / activate / deactivate schemes
- View all applications and move them through PENDING → UNDER_REVIEW → APPROVED/REJECTED
  (with a required rejection reason)
- View all registered users

---

## 2. Features

- JWT-based authentication with role-based access control (`USER` / `ADMIN`)
- Weighted eligibility-matching algorithm (see below) with human-readable reasons
- Multi-step eligibility questionnaire with a progress stepper
- Scheme catalogue with search + filters (state, category, income, age)
- Application submission + status tracking with a visual timeline
- Document upload with file-type and size validation
- Admin dashboard with scheme, application, and user management
- Global exception handling with consistent JSON error responses
- Responsive, professional UI (not a "basic CRUD" look) with loading/empty/error states,
  toast notifications, and confirmation dialogs

---

## 3. Technology Stack

**Frontend:** React 18, Vite, React Router, Axios, plain CSS design system (no UI kit
dependency, fully responsive)

**Backend:** Java 21, Spring Boot 3.3, Spring Web, Spring Data JPA, Spring Validation,
Spring Security + JWT (jjwt), Lombok

**Database:** PostgreSQL

---

## 4. Architecture

```
React Frontend (Vite, :5173)
        │  REST (JSON) / JWT Bearer
        ▼
Spring Boot Backend (:8090)
        │  Spring Data JPA
        ▼
PostgreSQL (smart_support_db)
```

Backend package layout:

```
com.smartsupport
├── controller     REST controllers (Auth, Scheme, Eligibility, Application, Document, Admin)
├── service        Business logic (incl. the eligibility matching algorithm)
├── repository     Spring Data JPA repositories
├── entity         JPA entities (User, Scheme, Application, Document, EligibilityResult)
├── dto            Request/response DTOs
├── security       JWT filter, JWT util, UserDetailsService, UserPrincipal
├── exception      Global exception handler + custom exceptions
└── config         Security config, CORS, static file serving, demo data seeder
```

Frontend layout:

```
frontend/src/
├── components/    Navbar, Footer, Card, SchemeCard, StatusBadge, Modal, LoadingSpinner, ...
├── pages/         One file per route (Landing, Login, EligibilityChecker, AdminDashboard, ...)
├── layouts/       PublicLayout (navbar+footer), AdminLayout (sidebar)
├── services/      Axios-based API clients, one per resource
├── context/       AuthContext, ToastContext
├── routes/        ProtectedRoute (auth + role guard)
├── App.jsx        Route definitions
└── main.jsx       Entry point
```

---

## 5. The Eligibility Matching Algorithm

Each scheme defines criteria: min/max age, max income, state/district, gender, disease/
condition, BPL requirement, and required documents. When a user submits the eligibility
form, every **active** scheme is scored using these weights:

| Criterion            | Weight |
|-----------------------|-------:|
| Income match          | 30%    |
| Age match              | 15%    |
| Location match (state/district) | 15% |
| Disease/condition match | 20%  |
| Document availability | 10%    |
| Other (gender + BPL)  | 10%    |

A scheme is marked **ELIGIBLE** only if every hard requirement is satisfied (age range,
income ceiling, location, gender, BPL, and disease when the scheme requires a specific
condition). The API always returns a `matchScore` (0–100) and a list of plain-English
`reasons` (✓ satisfied / ✗ not satisfied / ⚠ partially satisfied), e.g.:

```json
{
  "schemeId": 1,
  "schemeName": "Medical Financial Assistance Scheme (Demo)",
  "eligible": true,
  "matchScore": 92.0,
  "maximumAmount": 200000,
  "reasons": [
    "✓ Age requirement satisfied",
    "✓ Income within allowed limit",
    "✓ State/district requirement satisfied",
    "✓ Medical condition supported",
    "✓ Required documents available"
  ]
}
```

---

## 6. Database Setup

1. Install PostgreSQL locally (or use a container).
2. Create the database:

   ```sql
   CREATE DATABASE smart_support_db;
   ```

3. Tables are created/updated automatically on startup via
   `spring.jpa.hibernate.ddl-auto=update` — you do not need to run any DDL by hand.
4. On first startup, the backend automatically seeds:
   - A default **admin** account (`admin@smartsupport.com` / `Admin@1234` by default —
     override via `ADMIN_EMAIL` / `ADMIN_PASSWORD`)
   - **10 sample/demo schemes** covering medical, senior citizen, women's welfare,
     education, disability, emergency medical, low-income family, child healthcare,
     farmer assistance, and NGO medical aid categories

---

## 7. Backend Setup

The commands below are for Windows PowerShell. PostgreSQL must be running first.
This project uses Java 21 and the backend port `8090` to avoid conflicts with other
services that may already use port `8080`.

```powershell
Set-Location "C:\Users\Dharanish M\Downloads\smart-support-full-stack (2)\smart-support\backend"

Get-Service postgresql-x64-18
# If the service is stopped:
Start-Service postgresql-x64-18

$env:JAVA_HOME = (Get-ChildItem "$env:TEMP\temurin21-full" -Directory |
  Where-Object { Test-Path "$($_.FullName)\bin\java.exe" } |
  Select-Object -First 1 -ExpandProperty FullName)
$env:DB_URL = "jdbc:postgresql://localhost:5432/smart_support_db"
$env:DB_USERNAME = "postgres"
$env:DB_PASSWORD = "root@123"
$env:SERVER_PORT = "8090"
$env:CORS_ALLOWED_ORIGINS = "http://localhost:5173,http://localhost:5174"

& "$env:TEMP\apache-maven-3.9.10\bin\mvn.cmd" spring-boot:run
```

The backend starts on **http://localhost:8090**. Spring Boot creates the tables and
seeds the default admin and 10 demo schemes on the first successful startup.

> Spring Boot does not automatically load `.env` files. Set the variables in the
> terminal as shown above, or configure them in your IDE run configuration.

---

## 8. Frontend Setup

Open a second PowerShell terminal:

```powershell
Set-Location "C:\Users\Dharanish M\Downloads\smart-support-full-stack (2)\smart-support\frontend"

Set-Content .env "VITE_API_BASE_URL=http://localhost:8090/api"
npm install
npm run dev
```

Open the URL printed by Vite, normally **http://localhost:5173**. If port `5173` is
already in use, Vite automatically uses **http://localhost:5174**.

---

## 9. Environment Variables

### Backend (`backend/.env.example`)

| Variable | Description | Default |
|---|---|---|
| `DB_URL` | PostgreSQL JDBC URL | `jdbc:postgresql://localhost:5432/smart_support_db` |
| `DB_USERNAME` | PostgreSQL username | `postgres` |
| `DB_PASSWORD` | PostgreSQL password | *(set your own — do not commit)* |
| `SERVER_PORT` | Backend port | `8090` |
| `JWT_SECRET` | HMAC signing secret for JWTs | *(set your own — do not commit)* |
| `JWT_EXPIRATION_MS` | Token lifetime in ms | `86400000` (24h) |
| `UPLOAD_DIR` | Directory for uploaded documents | `uploads` |
| `CORS_ALLOWED_ORIGINS` | Comma-separated allowed origins | `http://localhost:5173` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seeded default admin login | `admin@smartsupport.com` / `Admin@1234` |

### Frontend (`frontend/.env`)

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL of the backend REST API | `http://localhost:8090/api` |

---

## 10. API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/schemes` | Public | List all active schemes |
| GET | `/api/schemes/{id}` | Public | Scheme details |
| POST | `/api/eligibility/check` | Public/Optional auth | Run eligibility matching |
| POST | `/api/applications` | User | Submit an application |
| GET | `/api/applications/my` | User | List my applications |
| GET | `/api/applications/{id}` | User | Application details |
| POST | `/api/documents/upload` | User | Upload a document (multipart) |
| GET | `/api/documents/my` | User | List my uploaded documents |
| GET | `/api/admin/dashboard` | Admin | Platform-wide stats |
| GET | `/api/admin/users` | Admin | List all users |
| GET | `/api/admin/schemes` | Admin | List all schemes (incl. inactive) |
| POST | `/api/admin/schemes` | Admin | Create a scheme |
| PUT | `/api/admin/schemes/{id}` | Admin | Update a scheme |
| DELETE | `/api/admin/schemes/{id}` | Admin | Delete a scheme |
| PATCH | `/api/admin/schemes/{id}/toggle-active` | Admin | Activate/deactivate a scheme |
| GET | `/api/admin/applications` | Admin | List all applications |
| PUT | `/api/admin/applications/{id}/status` | Admin | Update application status |

All responses are wrapped as:

```json
{ "success": true, "message": "...", "data": { ... } }
```

Errors:

```json
{ "success": false, "message": "Scheme not found", "data": null }
```

---

## 11. How to Run (Windows PowerShell)

1. Install PostgreSQL, Java 21, and Node.js 18+.
2. Create the database once: `CREATE DATABASE smart_support_db;`
3. Start PostgreSQL: `Start-Service postgresql-x64-18`.
4. In terminal 1, run the backend commands from section 7.
5. In terminal 2, run the frontend commands from section 8.
6. Open the Vite URL, normally **http://localhost:5173** or **http://localhost:5174**.
7. Log in as admin: `admin@smartsupport.com` / `Admin@1234`.

To verify data in PostgreSQL, open a third PowerShell terminal:

```powershell
$env:PGPASSWORD = "root@123"
$psql = "C:\Users\Dharanish M\Downloads\postgresssql\bin\psql.exe"

& $psql -h localhost -U postgres -d smart_support_db -c "SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name;"
& $psql -h localhost -U postgres -d smart_support_db -c "SELECT count(*) AS users FROM users; SELECT count(*) AS schemes FROM schemes; SELECT count(*) AS applications FROM applications;"
```

---

## 12. Default Admin Login

```
Email:    admin@smartsupport.com
Password: Admin@1234
```

(Change `ADMIN_EMAIL` / `ADMIN_PASSWORD` env vars before first startup to seed a
different admin account.)

## 13. Sample User Login

No sample end-user account is pre-seeded — register a new account from the **Register**
page to try the eligibility checker and application flow as a regular user.

---

## 14. Scheme Officer Logins

The existing 10 demo schemes each receive one separate officer account. No new schemes
are created and existing scheme criteria are unchanged.

| Scheme | Username | Password |
|---:|---|---|
| 1 | `scheme.officer.01@smartsupport.com` | `Officer@1001` |
| 2 | `scheme.officer.02@smartsupport.com` | `Officer@1002` |
| 3 | `scheme.officer.03@smartsupport.com` | `Officer@1003` |
| 4 | `scheme.officer.04@smartsupport.com` | `Officer@1004` |
| 5 | `scheme.officer.05@smartsupport.com` | `Officer@1005` |
| 6 | `scheme.officer.06@smartsupport.com` | `Officer@1006` |
| 7 | `scheme.officer.07@smartsupport.com` | `Officer@1007` |
| 8 | `scheme.officer.08@smartsupport.com` | `Officer@1008` |
| 9 | `scheme.officer.09@smartsupport.com` | `Officer@1009` |
| 10 | `scheme.officer.10@smartsupport.com` | `Officer@1010` |

After signing in, an officer sees only applications for the assigned scheme. The only
available officer statuses are **Document Verification**, **Review**, and **Approved**.
Each update is reflected in the applicant's **My Applications -> View Timeline** view.

---

## 15. Screenshots

*(Add screenshots of the landing page, eligibility checker, results page, and admin
dashboard here once you've run the app.)*

---

## 16. Future Enhancements

- Email/SMS notifications on application status change
- OTP-based phone/email verification at registration
- Refresh tokens + token revocation
- Admin analytics charts (trends over time, scheme popularity)
- Multi-language support
- Cloud storage (S3-compatible) for uploaded documents instead of local disk
- Pagination and server-side filtering for large scheme/application lists
