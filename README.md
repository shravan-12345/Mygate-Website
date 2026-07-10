
# Society Management & Visitor Management System (MERN)

## Status: Phase 5 of 8 complete

This project is being built in phases so each part is complete and reviewed
before moving on. See "Roadmap" below for what's done and what's next.

## Phase 1 — Backend core (done)
- Full project structure (config, controllers, middleware, models, routes, services, utils, uploads)
- MongoDB connection (Mongoose) — works with local MongoDB or MongoDB Atlas
- All 10 database models: User, Resident, SecurityGuard, Visitor, Delivery,
  Complaint, Notice, Maintenance, Notification, EmergencyContact
- JWT authentication with bcrypt password hashing
- Role-based access control middleware (`protect`, `authorize`)
- Auth APIs: register, login, logout, get current user, forgot password, reset password
- Admin registration-approval workflow (residents/guards need approval before login)
- Centralized error handling, async handler, file upload (multer) middleware
- Admin seed script to create the first admin account

## Phase 2 — Visitor Management + Security Guard APIs (done)
- **Visitor APIs** (`/api/visitors`): resident pre-registration with instant QR
  code generation, security guard walk-in gate entry (creates a pending
  approval request + notifies resident), resident approve/reject, security
  check-in/check-out, QR-code scan lookup, search/filter/pagination, CSV export
- **Delivery APIs** (`/api/deliveries`): delivery entry (notifies resident),
  delivery exit/status update, resident's own delivery list, filtered list for
  security/admin
- **Notification APIs** (`/api/notifications`): list own notifications
  (with unread count), mark one/all as read — used by the Visitor & Delivery
  flows above to alert residents ("Guest Arrived", "Delivery Waiting", etc.)
- **Security APIs** (`/api/security`): resident contact lookup by flat number
  or name (powers "Call Resident" / "Message Resident"), guard's own visitor
  and delivery history
- QR code generation utility (`qrcode` + `uuid` packages)

## Phase 4 — React frontend scaffold (done)
- **Vite + React Router** project fully wired — `npm run dev` proxies `/api`
  and `/uploads` to the backend on port 5000, no CORS config needed locally
- **Design system** (`src/index.css`): CSS variable tokens for the spec's
  Dark Blue / White / Light Gray / `#2563EB` palette, Plus Jakarta Sans +
  Inter + IBM Plex Mono type stack, reduced-motion support, visible focus rings
- **Context API**: `AuthContext` (session persistence + verification against
  `/auth/me` on load) and `ToastContext` (global toast queue)
- **Axios service layer**: one instance per backend module (`authService`,
  `visitorService`, `deliveryService`, `notificationService`,
  `complaintService`, `noticeService`, `maintenanceService`,
  `emergencyService`, `adminService`, `securityService`) — pages never call
  axios directly
- **Reusable components**, each with its own CSS file: Button, Input, Table
  (with pagination), Modal, ConfirmModal, Toast, Loader, Skeleton, Badge, Card
- **Layout shell**: public `Navbar`/`Footer` and a role-aware dashboard shell
  (`Sidebar` + `Topbar`, collapsible on desktop, drawer on mobile) — the
  Sidebar already maps every feature from the spec to a route per role
- **Routing**: `ProtectedRoute` (auth + role gating), public pages (Home,
  About, Contact), full auth flow (Login, Register with role-conditional
  fields, Forgot/Reset Password), a placeholder `/dashboard` landing page,
  and a 404 page

## Phase 5 — Residential Dashboard (done)
Two backend modules were added to close a gap in the original spec (Amenity
Booking wasn't in the original 10 collections) and to support self-service
profile editing:
- **Amenity model + APIs** (`/api/amenities`): admin manages bookable
  facilities (pool, clubhouse, etc.); residents book a slot with automatic
  capacity/double-booking checks, view/cancel their own bookings
- **Resident profile APIs** (`/api/residents`): view/update account + resident
  fields (photo upload, phone, block, ownership type, vehicles, emergency
  contact), add/edit/remove family members — flat number is intentionally
  locked from self-edit (admin-only change)
- **Change password** (`PUT /api/auth/change-password`) for the Settings page

**Frontend — Resident Dashboard pages, all wired to real APIs:**
- **Dashboard home** — live stat cards (pending visitor approvals, open
  complaints, maintenance due, unread notifications), each linking straight
  to the relevant page
- **Profile** — edit account details, photo upload with preview, vehicles, emergency contact
- **My Family** — add/edit/remove family members via modal + confirm-delete
- **Visitor Approval** — approve/reject pending visitors from a live table
- **Visitor QR Code** — pre-register a guest and get an instant shareable QR pass
- **Amenity Booking** — browse amenities, book a slot, view/cancel bookings
- **Complaints** — raise a complaint with a photo, track status, read admin replies
- **Society Notices** — view active, non-expired notices
- **Maintenance Bills** — view dues, pay a bill, download the PDF receipt
- **Notifications / Emergency Contacts / Settings** — shared pages used by
  every role (built once, reused in Phases 6 & 7)

All routes are individually role-gated via `<ProtectedRoute roles={[...]}>` —
a security guard or admin visiting a resident-only URL is redirected back to
`/dashboard`, not shown a broken page.

**Frontend (`/client`)**
- Resident Dashboard fully functional end-to-end. Security Guard (Phase 6)
  and Society Admin (Phase 7) dashboards are next.

## Phase 3 — Complaints, Notices, Maintenance, Emergency Contacts (done)
- **Complaint APIs** (`/api/complaints`): resident raises a complaint with an
  image upload (notifies all admins), admin lists/filters/paginates, updates
  status + reply (notifies the resident — "Complaint Updated")
- **Notice APIs** (`/api/notices`): admin create/edit/delete, residents &
  guards see only active non-expired notices by default (admin can include
  expired), broadcasts a "New Notice" notification to everyone on creation
- **Maintenance APIs** (`/api/maintenance`): admin generates a single bill or
  bulk-generates bills for every flat at once, residents view/pay their own
  bills, overdue bills are auto-flagged on read, paid bills get a unique
  receipt number and a **downloadable PDF receipt** (`/api/maintenance/:id/receipt`)
- **Emergency Contact APIs** (`/api/emergency-contacts`): admin CRUD,
  everyone can view active contacts (powers the "One Click Call" button)
- **Emergency Alert broadcast** (`POST /api/admin/emergency-alert`): admin
  sends an alert notification to every resident & guard at once

## Getting Started (Frontend)

```bash
cd client
cp .env.example .env
npm install
npm run dev   # starts on http://localhost:5173, proxies /api to :5000
```

Make sure the backend (`cd server && npm run dev`) is running first, then
open http://localhost:5173 — you can register, log in (after admin approval),
and land on the role-aware dashboard shell.

## Getting Started (Backend)

```bash
cd server
cp .env.example .env
# edit .env — set MONGO_URI (local or Atlas) and JWT_SECRET

npm install
node utils/seedAdmin.js   # creates first admin account (admin@society.com / Admin@123)
npm run dev                # starts on http://localhost:5000
```

Test it:
```bash
curl http://localhost:5000/api/health
```

Register a resident:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","phone":"9876543210","password":"password123","role":"resident","flatNumber":"A-101"}'
```

Then log in as admin, approve the resident via `PUT /api/admin/registrations/:userId`
with body `{"status":"approved"}`, and the resident can then log in.

### Phase 2 quick reference

```
POST   /api/visitors/pre-register        Resident pre-registers a visitor (returns QR code)
POST   /api/visitors/gate-entry          Security logs a walk-in guest (multipart, field: photo)
PUT    /api/visitors/:id/approve         Resident approves a pending request
PUT    /api/visitors/:id/reject          Resident rejects a pending request  { "reason": "..." }
PUT    /api/visitors/:id/check-in        Security checks visitor in at the gate
PUT    /api/visitors/:id/check-out       Security checks visitor out
POST   /api/visitors/scan-qr             Security scans a QR token  { "token": "..." }
GET    /api/visitors?search=&status=     Security/Admin — search & filter, paginated
GET    /api/visitors/my                  Resident's own visitor list
GET    /api/visitors/export              CSV export (Security/Admin)

POST   /api/deliveries                   Security logs a delivery (multipart, field: photo)
PUT    /api/deliveries/:id/exit          Security marks delivered/returned
GET    /api/deliveries/my                Resident's own deliveries
GET    /api/deliveries                   Security/Admin — filtered list

GET    /api/notifications                Logged-in user's notifications + unread count
PUT    /api/notifications/:id/read       Mark one as read
PUT    /api/notifications/read-all       Mark all as read

GET    /api/security/residents/search?query=A-101   Look up resident contact (Call/Message Resident)
GET    /api/security/my-history/visitors            Guard's own visitor check-in history
GET    /api/security/my-history/deliveries           Guard's own delivery history

POST   /api/complaints                   Resident raises a complaint (multipart, field: image)
GET    /api/complaints/my                Resident's own complaints
GET    /api/complaints?status=&category= Admin — filtered, paginated
PUT    /api/complaints/:id               Admin updates status/reply  { "status": "resolved", "adminReply": "..." }

POST   /api/notices                      Admin creates a notice (notifies everyone)
GET    /api/notices                      View active notices (all roles)
PUT    /api/notices/:id                  Admin edits a notice
DELETE /api/notices/:id                  Admin deletes a notice

POST   /api/maintenance                  Admin creates one bill  { "resident": "...", "billMonth": "2026-07", "amount": 2500, "dueDate": "..." }
POST   /api/maintenance/bulk             Admin generates the same bill for every flat
GET    /api/maintenance/my               Resident's own bills
PUT    /api/maintenance/:id/pay          Resident (or admin) marks a bill paid
GET    /api/maintenance/:id/receipt      Download the PDF receipt for a paid bill

GET    /api/emergency-contacts           View emergency contacts (all roles)
POST   /api/emergency-contacts           Admin adds a contact
POST   /api/admin/emergency-alert        Admin broadcasts an emergency alert to everyone

GET    /api/residents/me                 Get logged-in resident's profile
PUT    /api/residents/me                 Update profile (multipart, field: profileImage)
POST   /api/residents/me/family          Add a family member
PUT    /api/residents/me/family/:id      Update a family member
DELETE /api/residents/me/family/:id      Remove a family member
PUT    /api/auth/change-password         Change password (logged-in user)

GET    /api/amenities                    List amenities
POST   /api/amenities/bookings           Book an amenity slot (Resident)
GET    /api/amenities/bookings/my        Resident's own bookings
PUT    /api/amenities/bookings/:id/cancel  Cancel a booking
```

## Roadmap

- [x] **Phase 1** — Project setup + Backend core (auth, all models, RBAC)
- [x] **Phase 2** — Visitor Management + Security Guard APIs (entry/exit, QR codes, search/filter)
- [x] **Phase 3** — Complaints, Notices, Maintenance, Emergency Contacts APIs
- [x] **Phase 4** — React frontend scaffold (routing, Context API, Axios layer, reusable UI components)
- [x] **Phase 5** — Residential Dashboard pages
- [ ] **Phase 6** — Security Guard Dashboard pages
- [ ] **Phase 7** — Admin Dashboard pages + Reports/Analytics
- [ ] **Phase 8** — Polish (toasts, skeletons, 404 page) + AWS EC2/Nginx deployment config

## Tech Stack
- **Frontend:** React (Vite), React Router DOM, Axios, Pure CSS
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt, Multer
=======
# 🏢 My Gate

A modern **Gate Management System** built using the **MERN Stack**. The platform streamlines visitor management, resident access, security operations, and administrator controls through a secure and user-friendly interface.

## ✨ Features

* 🔐 Secure Authentication (JWT)
* 👤 Role-Based Access Control
* 🏠 Resident Dashboard
* 🛡️ Security Guard Dashboard
* 👨‍💼 Admin Dashboard
* 🚶 Visitor Registration & Management
* 📋 Visitor Approval Workflow
* 📊 Dashboard Analytics
* 📱 Responsive User Interface
* ⚡ RESTful API Architecture

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Axios
  
### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication

* JSON Web Token (JWT)
* bcrypt

## 📁 Project Structure

```text
mygate/
├── Frontend/
├── Backend/
├── docs/
├── README.md

### Clone the Repository

```bash
git clone https://github.com/<your-organization>/mygate-website.git

🚦 Getting Started`
Prerequisites
  Node.js (v18+)
  MongoDB Instance
  Exotel API Credentials
  Razorpay API Keys

Installation

# Backend
cd backend && npm install

# Frontend
cd frontend && npm install

### Running System

# Start Backend (from /backend)
npm run dev

# Start Frontend (from /frontend)
npm run dev

## 🔮 Future Enhancements

* QR Code Based Visitor Entry
* Email & SMS Notifications
* Visitor Pass Generation
* Apartment Management
* Complaint Management
* Delivery Tracking
* Mobile Application
* Reports & Analytics

## 🤝 Contributing

Contributions are welcome. Please create a feature branch, commit your changes, and submit a pull request.


**Developed with ❤️ using the MERN Stack.**
.
