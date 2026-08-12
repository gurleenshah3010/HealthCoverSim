# HealthCoverSim

HealthCoverSim is a full-stack private health insurance quote simulator.

The application allows users to create, view, edit and delete health insurance quotes. Quotes are stored in a SQLite database and premiums are calculated using hospital cover, extras cover, Lifetime Health Cover (LHC) loading, family fees and yearly discounts.

## Technologies

### Frontend
- React
- Vite
- React Router
- CSS

### Backend
- Node.js
- Express
- SQLite

## Features

- Create health insurance quotes
- View all saved quotes
- View detailed quote calculations
- Edit existing quotes
- Delete quotes
- SQLite database persistence
- Single, Couple and Family cover
- Conditional second applicant fields
- Hospital and Extras cover options
- Lifetime Health Cover loading calculations
- "Not sure" LHC warning
- Family fee calculation
- Monthly and Yearly payment options
- Yearly discounts from 0% to 10%
- Frontend and backend validation
- Detailed premium breakdown

## Requirements

Before running the project, install:

- Node.js
- npm

## Project Setup

Clone the repository:

```bash
git clone https://github.com/gurleenshah3010/HealthCoverSim.git
cd HealthCoverSim
```

## Backend Setup

Open a terminal and run:

```bash
cd backend
npm install
node server.js
```

The backend runs on:

```text
http://localhost:5000
```

## Database Setup

HealthCoverSim uses SQLite.

The database and `quotes` table are created automatically when the backend starts, so no manual database setup is required.

The SQLite database file is ignored by Git and will be created locally.

## Frontend Setup

Open a second terminal and run:

```bash
cd frontend
npm install
npm run dev
```

Open the address displayed by Vite, normally:

```text
http://localhost:5173
```

## Quote Calculation Rules

### Hospital Cover Monthly Price Per Adult

| Cover | Price |
|---|---:|
| None | $0 |
| Basic | $90 |
| Bronze | $120 |
| Silver | $160 |
| Gold | $220 |

### Extras Cover Monthly Price Per Adult

| Cover | Price |
|---|---:|
| None | $0 |
| Basic | $25 |
| Standard | $45 |
| Premium | $70 |

### Adults

- Single: 1 adult
- Couple: 2 adults
- Family: 2 adults

Family cover also includes a $30 monthly family fee.

## Lifetime Health Cover Loading

Lifetime Health Cover loading applies only to hospital cover. It does not apply to extras cover.

- Cover history "Yes": 0% loading
- Cover history "No" and age over 30: `(age - 30) × 2%`
- Age 30 or younger: 0%
- Cover history "Not sure": 0% loading and a warning is displayed
- Hospital cover "None": no LHC loading is applied

## Yearly Discount

A yearly discount can be entered from 0% to 10%.

The discount is only applied when the payment frequency is Yearly.

Monthly quotes do not receive the annual discount.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/quotes` | Get all quotes |
| GET | `/api/quotes/:id` | Get one quote and calculation |
| POST | `/api/quotes` | Create a quote |
| PUT | `/api/quotes/:id` | Update a quote |
| DELETE | `/api/quotes/:id` | Delete a quote |
| POST | `/api/calculate` | Calculate a quote |

## Worked Example

Example inputs:

- Cover Type: Family
- Applicant 1: age 40, history No
- Applicant 2: age 35, history Yes
- Hospital Cover: Silver
- Extras Cover: Standard
- Payment Frequency: Yearly
- Annual Discount: 5%

Expected results:

- Applicant 1 LHC: 20%
- Applicant 2 LHC: 0%
- Hospital Total: $352.00 per month
- Extras Total: $90.00 per month
- Family Fee: $30.00 per month
- Monthly Premium: $472.00
- Yearly Before Discount: $5,664.00
- Yearly After Discount: $5,380.80
