# Car Washing Sales Management System (CWSMS)

This project implements the SmartPark Car Washing Sales Management System for the TSS National Integrated Assessment 2024–2025 scenario.

## Scenario Summary
SmartPark (Rubavu District, Western Province, Rwanda) needs a web-based system to replace manual paper processes for car washing sales. The system records cars, service packages, service records, payments, and produces invoices and daily reports.

## Requirements Covered
- Entities: **Car, Package, ServiceRecord, Payment**
- CRUD rules:
  - Insert: Car, Package, ServiceRecord, Payment
  - Update/Delete/Retrieve: ServiceRecord only
- Session-based login with username/password
- Bill generation for a package
- Daily report: PlateNumber, PackageName, PackageDescription, AmountPaid, PaymentDate
- Responsive web UI
- Backend: Node.js + Express
- Database: MongoDB Cluster (Atlas)
- Frontend: React + Tailwind CSS

## Project Structure
- `backend-project` — Node.js/Express API + MongoDB (Mongoose)
- `frontend-project` — React + Tailwind UI

## Database Seed Data (Packages)
The backend seeds default packages on startup (if none exist):
- Basic wash — Exterior hand wash — 5000 RWF
- Classic wash — Interior hand wash — 10,000 RWF
- Premium wash — Exterior and Interior hand wash — 20,000 RWF

## Setup

### 1) Backend
Create `backend-project/.env` (copy from `.env.example`) and fill:

```
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.mongodb.net
DB_NAME=CWSMS
SESSION_SECRET=your_long_random_secret
CORS_ORIGIN=http://localhost:5173
PORT=4000
```

Start backend:
```
cd backend-project
npm install
npm run dev
```

### 2) Frontend
```
cd frontend-project
npm install
npm run dev
```

## Usage Flow
1) Register and login.
2) Add Cars.
3) Create Service Records by selecting a Car + Package.
4) Make Payments by selecting an unpaid Service Record.
5) Reports page shows daily report + recorded data.
6) Bill is generated from a Service Record.

## Assessment Notes (From Task Sheet)
- ERD should be drawn on paper with correct symbols and cardinalities.
- Database name: **CWSMS**
- Backend folder: **backend-project**
- Frontend folder: **frontend-project**
- Folder naming for submission: **FirstName_LastName_National_Practical_Exam_2025**

## Known Constraints
- Payment is attached to a Service Record (one payment per service record).

---
If you need a printable ERD or invoice template, I can add it.
