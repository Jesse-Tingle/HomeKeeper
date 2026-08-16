<div align="center">

# HomeKeeper

![Landing Page Screenshot](./docs/images/landing-page.png)

### A full-stack home maintenance management platform for organizing properties, tracking household assets, and preserving maintenance history.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#license)
[![Status](https://img.shields.io/badge/Status-Active%20Development-2563EB)](#project-status)

[Features](#features) · [Architecture](#application-architecture) · [Getting Started](#getting-started) · [API](#api-overview) · [Roadmap](#roadmap)

</div>

---

## Overview

**HomeKeeper** is a full-stack web application designed to help homeowners organize and manage the physical systems, appliances, equipment, and maintenance history associated with one or more properties.

Important home information is often scattered across paper receipts, appliance manuals, email inboxes, spreadsheets, and memory. HomeKeeper brings that information together in one structured system. Users can create property records, catalog household assets, record identifying and warranty information, and maintain a chronological history of inspections, service appointments, repairs, and replacements.

The application was built as a portfolio project to demonstrate practical full-stack software engineering skills, including:

- Relational database design
- RESTful API development
- Authentication and authorization
- Protected client-side routing
- Reusable React component architecture
- Form handling and validation
- Responsive interface design
- Maintainable project organization
- Git-based feature development and pull request workflows

> **Current status:** The core application experience is implemented and under active development. Deployment, automated testing, and additional production-hardening work are planned before the first stable release.

---

## Table of Contents

- [Overview](#overview)
- [Product Goals](#product-goals)
- [Features](#features)
- [Application Preview](#application-preview)
- [User Experience](#user-experience)
- [Technology Stack](#technology-stack)
- [Application Architecture](#application-architecture)
- [Data Model](#data-model)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Available Scripts](#available-scripts)
- [API Overview](#api-overview)
- [Authentication](#authentication)
- [Validation and Error Handling](#validation-and-error-handling)
- [Security Considerations](#security-considerations)
- [Accessibility and Responsive Design](#accessibility-and-responsive-design)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Known Limitations](#known-limitations)
- [Key Engineering Decisions](#key-engineering-decisions)
- [What This Project Demonstrates](#what-this-project-demonstrates)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

---

## Product Goals

HomeKeeper is intended to make home ownership and long-term property care easier by giving users a clear place to answer questions such as:

- What appliances and major systems belong to this property?
- What is the model or serial number of a specific asset?
- When was an item installed or purchased?
- Is an asset still under warranty?
- What maintenance has already been completed?
- How much has been spent on repairs or service?
- Which property does a particular asset belong to?
<!-- - Who within a household has access to the property record? -->

The product is designed around three core principles:

1. **Centralization**  
   Keep property, asset, and maintenance information in one organized system.

2. **Traceability**  
   Preserve a useful historical record of inspections, service, repairs, and replacements.

<!-- 3. **Scalability**  
   Support multiple properties and multiple household members through a relational membership model. -->

---

## Features

### Authentication

- User registration
- Secure password hashing
- JWT-based authentication
- Persistent authentication across browser refreshes
- Protected application routes
- Authenticated user restoration through the `/auth/me` endpoint
- Logout support
- Improved loading and error states
- Password visibility controls on authentication forms

### Property Management

- View all homes associated with the authenticated user
- Create new homes
- View complete home details
- Edit existing home information
- Support for multiple homes per user
- Structured address information
- Optional property type
- Membership-based relationship between users and homes

### Asset Management

- Add assets to a selected home
- View assets within their parent property
- View detailed asset information
- Store:
  - Asset name
  - Category
  - Manufacturer
  - Model number
  - Serial number
  - Location within the property
  - Installation date
  - Warranty expiration date
  - Expected lifespan
  - Purchase cost
  - Notes
- Reusable asset card components
- Direct navigation between asset details and the parent home
- Collapsible asset creation interface

### Maintenance History

- Create maintenance events for an asset
- View maintenance history by asset
- Categorize events as:
  - Inspection
  - Service
  - Repair
  - Replacement
- Record:
  - Event date
  - Event type
  - Cost
  - Notes
- Preserve chronological service and repair records

### Dashboard and Interface

- SaaS-inspired dashboard experience
- Shared responsive application layout
- Sidebar navigation
- User profile section
- Home and asset statistics
- Recent asset information
- Maintenance history summaries
- Reusable card and button styles
- Purpose-built empty states
- Responsive desktop and mobile layouts
- Branded login and registration experience
- Consistent HomeKeeper visual language across public and protected pages

---

## Application Preview

> Add screenshots after the application is deployed or after image files are added to the repository.

1. Landing page
2. Dashboard
3. Homes page
4. Home details with asset cards
5. Asset details with maintenance history
6. Login and registration pages

Suggested repository structure:

```text
docs/
└── images/
    ├── landing-page.png
    ├── dashboard.png
    ├── homes-page.png
    ├── home-details.png
    ├── asset-details.png
    └── authentication.png
```


![Dashboard screenshot](./docs/images/dashboard.png)

### Live Demo

A hosted demo is not currently available.

Once deployed, add:

- **Live application:** `https://your-homekeeper-app-url.com`
- **API health endpoint:** `https://your-api-url.com/health`
- **Demo account:** Provide a seeded, non-sensitive account for reviewers

---

## User Experience

A typical HomeKeeper workflow is:

1. A user creates an account or signs in.
2. The user arrives at the dashboard and sees an overview of their property data.
3. The user creates one or more home records.
4. From a home details page, the user adds appliances, systems, tools, or other assets.
5. The user opens an asset to review its model, serial number, cost, warranty, installation information, and notes.
6. The user records maintenance events as inspections, services, repairs, or replacements occur.
7. HomeKeeper preserves the asset's maintenance history for future reference.

---

## Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | Component-based user interface |
| React Router 7 | Client-side routing and protected navigation |
| Vite 8 | Development server and production build tooling |
| JavaScript | Application logic |
| CSS | Custom responsive design system |
| Browser `fetch` API | Communication with the backend REST API |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express 5 | REST API and middleware |
| PostgreSQL | Relational data persistence |
| `pg` | PostgreSQL client for Node.js |
| JSON Web Tokens | Stateless authentication |
| `bcryptjs` | Password hashing |
| Zod | Request and data validation |
| CORS | Frontend-to-backend request configuration |
| dotenv | Environment variable management |
| Nodemon | Local development server reloading |

### Development Practices

- Conventional commit messages
- Feature-based pull requests
- Modular route, controller, service, and model organization
- Reusable frontend components
- Environment-based configuration
- Relational database constraints
- Protected route architecture
- Shared styling foundations

---

## Application Architecture

HomeKeeper uses a client-server architecture:

```text
┌───────────────────────────────┐
│          React Client         │
│                               │
│  Pages · Components · Context │
│  React Router · API Client    │
└───────────────┬───────────────┘
                │
                │ HTTP / JSON
                │ Authorization: Bearer <token>
                ▼
┌───────────────────────────────┐
│          Express API          │
│                               │
│ Routes · Middleware           │
│ Controllers · Services        │
│ Models · Validation           │
└───────────────┬───────────────┘
                │
                │ SQL
                ▼
┌───────────────────────────────┐
│         PostgreSQL DB         │
│                               │
│ Users · Homes · Memberships   │
│ Assets · Maintenance Events   │
└───────────────────────────────┘
```

### Frontend Responsibilities

The React application is responsible for:

- Rendering public and authenticated interfaces
- Managing authentication state
- Persisting and attaching JWT credentials
- Handling client-side routing
- Submitting forms
- Displaying loading, error, empty, and success states
- Presenting homes, assets, and maintenance records
- Providing responsive navigation and layout

### Backend Responsibilities

The Express API is responsible for:

- Registering and authenticating users
- Hashing and verifying passwords
- Creating and validating JWTs
- Protecting private endpoints
- Validating incoming request data
- Enforcing ownership and membership rules
- Performing database operations
- Returning structured JSON responses

### Database Responsibilities

PostgreSQL is responsible for:

- Persisting user, property, asset, and maintenance data
- Enforcing unique user emails
- Preserving relationships through foreign keys
- Preventing duplicate home memberships
- Restricting membership roles to supported values
- Restricting maintenance event types to supported categories

---

## Data Model

The application currently includes five primary tables.

### Users

Stores registered user accounts.

Key fields:

- `id`
- `name`
- `email`
- `password_hash`
- `created_at`
- `updated_at`

### Homes

Stores property records.

Key fields:

- `id`
- `name`
- `street_address`
- `city`
- `state`
- `postal_code`
- `country`
- `type`
- `created_by_user_id`
- `created_at`
- `updated_at`

### Home Memberships

Creates a many-to-many relationship between users and homes.

Key fields:

- `id`
- `user_id`
- `home_id`
- `role`
- `joined_at`
- `created_at`
- `updated_at`

Supported roles:

- `owner`
- `admin`
<!-- - `member` -->

### Assets

Stores property-specific appliances, systems, equipment, and other items.

Key fields:

- `id`
- `home_id`
- `name`
- `category`
- `manufacturer`
- `model_number`
- `serial_number`
- `location`
- `install_date`
- `warranty_expiration_date`
- `expected_lifespan_years`
- `purchase_cost`
- `notes`
- `created_by_user_id`
- `created_at`
- `updated_at`

### Maintenance Events

Stores maintenance history for an asset.

Key fields:

- `id`
- `asset_id`
- `event_type`
- `event_date`
- `cost`
- `notes`
- `created_by_user_id`
- `created_at`
- `updated_at`

Supported event types:

- `inspection`
- `service`
- `repair`
- `replacement`

### Entity Relationship Summary

```text
User
 ├── creates many Homes
 ├── belongs to many Homes through Home Memberships
 ├── creates many Assets
 └── creates many Maintenance Events

Home
 ├── has many Home Memberships
 └── has many Assets

Asset
 ├── belongs to one Home
 └── has many Maintenance Events
```

---

## Project Structure

```text
home-maintenance-tracker/
├── backend/
│   ├── database/
│   │   ├── schema/
│   │   │   └── create_tables.sql
│   │   └── seeds/
│   │       └── dev_seed.sql
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── app.js
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── apiClient.js
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   └── ...
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── layouts/
│   │   │   └── Layout.jsx
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── package-lock.json
├── .gitignore
└── README.md
```

> The exact structure may evolve as testing, deployment configuration, migrations, and additional features are introduced.

---

## Getting Started

### Prerequisites

Install the following before running HomeKeeper locally:

- [Node.js](https://nodejs.org/) 20 or newer
- npm
- [PostgreSQL](https://www.postgresql.org/) 15 or newer
- Git

Verify the installations:

```bash
node --version
npm --version
psql --version
git --version
```

### Clone the Repository

```bash
git clone https://github.com/Jesse-Tingle/home-maintenance-tracker.git
cd home-maintenance-tracker
```

### Install Backend Dependencies

```bash
cd backend
npm install
```

### Install Frontend Dependencies

Open another terminal from the repository root:

```bash
cd frontend
npm install
```

---

## Environment Variables

Create a `.env` file inside the `backend` directory:

```text
backend/.env
```

Example:

```env
PORT=5000
NODE_ENV=development

# Optional managed PostgreSQL connection URL.
# When set, the individual DB_* values are not required.
DATABASE_URL=

DB_HOST=localhost
DB_PORT=5432
DB_NAME=homekeeper_dev
DB_USER=your_postgres_username
DB_PASSWORD=

JWT_SECRET=replace_with_a_secure_secret_at_least_32_characters
CLIENT_URL=http://localhost:5173
```

### Environment Variable Reference

| Variable | Required | Description | Example |
|---|---:|---|---|
| `NODE_ENV` | No | Application environment; defaults to `development` | `development` |
| `PORT` | No | Port used by the Express server; defaults to `5000` | `5000` |
| `DATABASE_URL` | No | Managed PostgreSQL connection URL. When provided, the individual `DB_*` connection variables are not required | `postgresql://user:password@host/database` |
| `DB_HOST` | Unless `DATABASE_URL` is set | PostgreSQL host | `localhost` |
| `DB_PORT` | Unless `DATABASE_URL` is set | PostgreSQL port | `5432` |
| `DB_NAME` | Unless `DATABASE_URL` is set | PostgreSQL database name | `homekeeper_dev` |
| `DB_USER` | Unless `DATABASE_URL` is set | PostgreSQL username | `postgres` |
| `DB_PASSWORD` | Production, unless `DATABASE_URL` is set | PostgreSQL password; may be blank for local development | `your_password` |
| `JWT_SECRET` | Yes | Secret used to sign authentication tokens; minimum 32 characters | Long random string |
| `CLIENT_URL` | Yes | Frontend origin allowed by backend CORS | `http://localhost:5173` |

HomeKeeper supports two PostgreSQL configuration methods:

1. **Connection URL** — Set `DATABASE_URL` when using a managed PostgreSQL provider.
2. **Individual connection values** — Leave `DATABASE_URL` blank and configure `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, and `DB_PASSWORD`.

When `DATABASE_URL` is configured, it takes precedence over the individual `DB_*` connection values.

Generate a strong JWT secret with Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

> Never commit `.env` files, database passwords, JWT secrets, or production credentials to source control.

### Frontend API Configuration

The frontend API URL is configured through the `VITE_API_URL` environment variable.

Create:

```text
frontend/.env
```

```env
VITE_API_URL=http://localhost:5000
```

Then access it through:

```js
const API_URL = import.meta.env.VITE_API_URL;
```

---

## Database Setup

### 1. Create the Development Database

```bash
createdb homekeeper_dev
```

Alternatively:

```bash
psql -U your_postgres_username
```

Then:

```sql
CREATE DATABASE homekeeper_dev;
```

Exit PostgreSQL:

```sql
\q
```

### 2. Run the Schema

From the repository root:

```bash
psql -U your_postgres_username \
  -d homekeeper_dev \
  -f backend/database/schema/create_tables.sql
```

### 3. Load Development Seed Data

If the seed file is ready for use:

```bash
psql -U your_postgres_username \
  -d homekeeper_dev \
  -f backend/database/seeds/dev_seed.sql
```

### 4. Confirm the Tables

```bash
psql -U your_postgres_username -d homekeeper_dev
```

Then:

```sql
\dt
```

Expected tables:

```text
users
homes
home_memberships
assets
maintenance_events
```

---

## Running the Application

HomeKeeper currently runs the frontend and backend as separate development processes.

### Start the Backend

From the repository root:

```bash
cd backend
npm run dev
```

The API will run at:

```text
http://localhost:5000
```

### Start the Frontend

In a separate terminal:

```bash
cd frontend
npm run dev
```

The client will typically run at:

```text
http://localhost:5173
```

Open that URL in a browser.

---

## Available Scripts

### Frontend

Run these commands inside `frontend/`.

| Command | Description |
|---|---|
| `npm run dev` | Starts the Vite development server |
| `npm run build` | Creates a production build |
| `npm run lint` | Runs ESLint |
| `npm run preview` | Serves the production build locally |

### Backend

Run these commands inside `backend/`.

| Command | Description |
|---|---|
| `npm run dev` | Starts the API with Nodemon |
| `npm start` | Starts the API with Node.js |
| `npm test` | Reserved for the future automated test suite |

---

## API Overview

The API follows REST-style conventions and returns JSON.

### Base URL

Local development:

```text
http://localhost:5000
```

### Authentication Routes

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| `POST` | `/auth/register` | Registers a new user | Public |
| `POST` | `/auth/login` | Authenticates a user | Public |
| `GET` | `/auth/me` | Returns the authenticated user | Required |

### Home Routes

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| `GET` | `/homes` | Returns homes available to the user | Required |
| `POST` | `/homes` | Creates a new home | Required |
| `GET` | `/homes/:id` | Returns a single home | Required |
| `PUT` | `/homes/:id` | Updates a home | Required |
| `DELETE` | `/homes/:id` | Deletes a home | Required |

### Asset Routes

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| `GET` | `/homes/:homeId/assets` | Returns assets belonging to a home | Required |
| `POST` | `/homes/:homeId/assets` | Creates an asset for a home | Required |
| `GET` | `/assets/:id` | Returns an individual asset | Required |
| `PUT` | `/assets/:id` | Updates an asset | Required |
| `DELETE` | `/assets/:id` | Deletes an asset | Required |

### Maintenance Event Routes

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| `GET` | `/assets/:assetId/maintenance-events` | Returns an asset's maintenance history | Required |
| `POST` | `/assets/:assetId/maintenance-events` | Creates a maintenance event | Required |
| `GET` | `/maintenance-events/:id` | Returns a maintenance event | Required |
| `PUT` | `/maintenance-events/:id` | Updates a maintenance event | Required |
| `DELETE` | `/maintenance-events/:id` | Deletes a maintenance event | Required |

> Confirm endpoint paths against the current route files as the API evolves. This table reflects the intended resource model and current application behavior.

### Example Authenticated Request

```bash
curl http://localhost:5000/homes \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Example Create Home Request

```bash
curl -X POST http://localhost:5000/homes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Primary Residence",
    "street_address": "123 Main Street",
    "city": "Logansport",
    "state": "Indiana",
    "postal_code": "46947",
    "country": "USA",
    "type": "Single-family home"
  }'
```

---

## Authentication

HomeKeeper uses JWT-based authentication.

### Authentication Flow

1. A user registers or signs in.
2. The backend verifies the submitted credentials.
3. The backend returns a signed JWT.
4. The frontend stores the token in browser storage.
5. The custom API client attaches the token to authenticated requests.
6. Protected backend middleware verifies the token.
7. On application startup, the frontend calls `/auth/me` to restore the authenticated session.
8. Protected React routes wait for authentication restoration before rendering or redirecting.

### Authorization Header

Authenticated requests use:

```http
Authorization: Bearer <token>
```

### Password Handling

Passwords are never stored directly. The backend uses `bcryptjs` to hash passwords before saving them and to verify credentials during login.

---

## Validation and Error Handling

HomeKeeper uses Zod validation on the backend to prevent malformed or incomplete data from reaching application logic or the database.

Validation responsibilities include:

- Required field checks
- Email format validation
- Password requirements
- UUID parameter validation
- Home payload validation
- Asset payload validation
- Maintenance event validation
- Supported role and event type restrictions

The frontend also performs user-facing checks such as password confirmation before submitting registration data.

A long-term goal is to standardize all API errors using a structure such as:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The submitted request could not be processed.",
    "details": []
  }
}
```

---

## Security Considerations

The project currently demonstrates several important security practices:

- Password hashing
- JWT-protected routes
- Authorization headers
- Server-side validation
- Parameterized PostgreSQL queries
- Protected client-side routes
- Restricted CORS configuration during local development
- Secrets stored in environment variables

Before production deployment, the following improvements are recommended:

- Add Helmet security headers
- Add rate limiting to authentication endpoints
- Use an environment-based CORS allowlist
- Set explicit JWT expiration policies
- Add refresh-token or secure cookie-based session handling
- Add centralized production error handling
- Validate environment variables at startup
- Add request size limits
- Add database migrations
- Add automated authorization tests
- Remove or protect development-only endpoints

---

## Accessibility and Responsive Design

HomeKeeper is designed to provide a usable experience across desktop and mobile screen sizes.

Current interface considerations include:

- Semantic form labels
- Keyboard-accessible controls
- Visible focus states
- Responsive layouts
- Clear loading indicators
- Error alerts
- Descriptive button text
- `aria-label` usage for icon-only controls
- Reduced-motion support in authentication styling
- Consistent visual hierarchy
- High-contrast primary actions

Future accessibility work will include:

- Lighthouse accessibility audits
- Automated Axe testing
- Modal focus management
- Expanded screen-reader testing
- Full keyboard-only workflow testing
- Additional color contrast verification

---

## Development Workflow

The repository is developed using feature-focused commits and pull requests.

Examples of the project's commit conventions:

```text
feat: add reusable asset card component
feat: implement home editing functionality
feat: add collapsible asset creation form
feat: persist user authentication across page refreshes
feat: redesign login and registration pages
style: add responsive application layout
refactor: introduce shared application layout
```

Recommended branch naming:

```text
feature/add-maintenance-scheduling
fix/asset-details-loading-state
refactor/extract-home-form
docs/add-project-readme
test/add-auth-integration-tests
```

Recommended commit types:

| Type | Purpose |
|---|---|
| `feat` | New user-facing functionality |
| `fix` | Bug correction |
| `refactor` | Internal code improvement without behavior change |
| `style` | Visual or formatting changes |
| `test` | Test additions or changes |
| `docs` | Documentation changes |
| `chore` | Tooling, dependencies, or maintenance |

---

## Testing

Automated testing has not yet been implemented.

A planned testing strategy includes:

### Backend

- Unit tests for validation and service logic
- Integration tests for authentication
- Integration tests for home, asset, and maintenance endpoints
- Authorization tests ensuring one user cannot access another user's records
- Dedicated PostgreSQL test database
- Supertest-based API testing

### Frontend

- Authentication form tests
- Protected route tests
- Loading and error state tests
- Home creation and editing tests
- Asset creation tests
- Component accessibility tests
- React Testing Library integration tests

### End-to-End

- Registration and login flow
- Create home flow
- Create asset flow
- Add maintenance event flow
- Session restoration after browser refresh
- Logout flow

Recommended tools:

- Vitest
- React Testing Library
- Supertest
- Playwright

---

## Deployment

The application is not currently deployed.

A recommended production architecture is:

```text
Frontend: Vercel or Netlify
Backend: Render, Railway, Fly.io, or similar
Database: Managed PostgreSQL
CI/CD: GitHub Actions
```

Before deployment:

- Configure production environment variables
- Replace hard-coded development URLs
- Configure production CORS
- Add a health endpoint
- Run the frontend production build
- Add database migrations
- Add production logging
- Add error monitoring
- Seed a safe demo account
- Confirm all secrets are excluded from Git
- Add automated tests and CI checks

---

## Roadmap

### Portfolio-Ready Milestone

- [ ] Add polished screenshots and social preview image
- [ ] Deploy frontend, backend, and database
- [ ] Add a seeded demo account
- [ ] Add root `.env.example` documentation
- [ ] Add centralized error handling
- [ ] Add API security middleware
- [ ] Add backend integration tests
- [ ] Add frontend component tests
- [ ] Add GitHub Actions CI
- [ ] Add database migrations
- [ ] Complete edit and delete workflows
- [ ] Add toast notifications
- [ ] Complete accessibility audit

### Product Enhancements

- [ ] Scheduled maintenance tasks
- [ ] Recurring maintenance intervals
- [ ] Upcoming and overdue maintenance views
- [ ] Warranty expiration alerts
- [ ] Asset search, filtering, and sorting
- [ ] Maintenance cost summaries
- [ ] Dashboard charts and trends
- [ ] Asset photo uploads
- [ ] Receipt and manual attachments
- [ ] Household invitations
- [ ] Role-based permissions
- [ ] CSV export
- [ ] PDF maintenance reports
- [ ] Email reminders
- [ ] Calendar integration
- [ ] Progressive Web App support

---

## Known Limitations

- The application currently requires local PostgreSQL setup.
- A hosted demo is not yet available.
- Automated tests are not yet configured.
- The backend CORS configuration is currently intended for local development.
- Database schema changes are managed through SQL setup files rather than formal migrations.
- Some full edit and delete workflows may still require frontend completion.
- Maintenance events currently focus on historical records rather than future scheduling.
- File uploads and document storage are not yet supported.
- Household invitations and advanced permissions are not yet exposed through the interface.

---

## Key Engineering Decisions

### Why PostgreSQL?

The application has strongly related data:

- Users belong to homes.
- Homes contain assets.
- Assets contain maintenance events.
- Homes may be shared by multiple users.

PostgreSQL provides foreign keys, unique constraints, check constraints, transactions, and reliable relational querying that fit this domain well.

### Why a Membership Table?

A direct `user_id` field on a home would limit each property to one user. The `home_memberships` table supports:

- Multiple users per home
- Multiple homes per user
- Future invitation workflows
- Role-based access
- Shared household management

### Why JWT Authentication?

JWT authentication allows the React client and Express API to communicate through a clear bearer-token workflow while keeping the backend stateless.

### Why a Custom API Client?

The frontend API client centralizes:

- Base URL handling
- Authentication headers
- JSON parsing
- Error handling
- Reusable HTTP methods

It also keeps page components focused on user interface behavior instead of repeating networking logic.

### Why Reusable Components?

Components such as `AssetCard`, `HomeSummaryCard`, `AuthLayout`, `Layout`, and `ProtectedRoute` reduce duplication and establish consistent behavior and styling across the application.

---

## What This Project Demonstrates

HomeKeeper demonstrates practical experience with:

### Frontend Engineering

- React component design
- Context-based authentication state
- Protected routing
- Controlled forms
- Reusable UI composition
- Responsive CSS
- Error and loading states
- Navigation architecture

### Backend Engineering

- Express routing
- Authentication middleware
- Password hashing
- JWT generation and verification
- Zod request validation
- Layered backend organization
- PostgreSQL integration
- RESTful resource modeling

### Database Engineering

- UUID primary keys
- Foreign key relationships
- Unique constraints
- Check constraints
- Many-to-many relationships
- Domain-oriented schema design

### Software Development Practices

- Incremental feature delivery
- Pull request documentation
- Conventional commits
- Refactoring toward reusable abstractions
- Separation of frontend and backend concerns
- Product-focused interface development

---

## Contributing

This project is primarily a personal portfolio application, but constructive feedback and issue reports are welcome.

To propose a change:

1. Fork the repository.
2. Create a branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Make and test your changes.
4. Commit using a descriptive conventional commit:

   ```bash
   git commit -m "feat: add your feature"
   ```

5. Push the branch:

   ```bash
   git push origin feature/your-feature-name
   ```

6. Open a pull request with:
   - A clear summary
   - A list of changes
   - Testing notes
   - Screenshots for UI changes
   - Any known limitations

---

## License

This project is available under the MIT License.

Add a root `LICENSE` file containing the official MIT License text before treating the project as formally licensed.

---

## Author

**Jesse Tingle**

- GitHub: [@Jesse-Tingle](https://github.com/Jesse-Tingle)
- Repository: [home-maintenance-tracker](https://github.com/Jesse-Tingle/home-maintenance-tracker)

---

<div align="center">

Built to make home maintenance records easier to organize, understand, and use.

**HomeKeeper — know your home, protect your investment.**

</div>
