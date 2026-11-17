# SpendWise – MERN Capstone

A personal income and expense tracker built with React, Express, MongoDB and Node.js.

## Requirements
- Node.js 18+ and npm
- MongoDB Atlas account or local MongoDB
- Postman (for API testing)

## 1. Configure backend
```bash
cd backend
npm install
cp .env.example .env
```
Edit `.env`: set your MongoDB connection string, two long random JWT secrets, and `CLIENT_URL=http://localhost:5173`. Never commit `.env`.

Start backend: `npm run dev` (http://localhost:5000). Health check: `GET http://localhost:5000/api/health`.

## 2. Configure frontend
Open a second terminal:
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Open http://localhost:5173.

## 3. Database collections
- **users**: name, email (unique), password hash, role, tokenVersion.
- **transactions**: user reference, type, title, amount, category, date, note.
- **budgets**: user reference, category, YYYY-MM month, limit. Unique compound index on user+category+month.

Indexes: users.email unique; transactions.user+date and user+category; budgets.user+category+month unique. Transaction summaries and category totals use MongoDB aggregation pipelines.

## 4. Roles
Registration creates normal `user` accounts. For a classroom demo, create your first account, then promote it to admin using MongoDB Compass: open `users`, find your own record, edit `role` from `user` to `admin`. Do not expose public admin registration. Log out and log in again after promotion.

## 5. API routes
- POST `/api/auth/register`, `/login`, `/refresh`, `/logout`; GET `/auth/me`
- GET `/api/transactions`, POST `/api/transactions`, GET `/api/transactions/summary`, PUT/DELETE `/api/transactions/:id`
- GET/POST `/api/budgets`, DELETE `/api/budgets/:id`
- Admin only: GET `/api/admin/users`, `/api/admin/stats`

Protected API requests use `Authorization: Bearer <accessToken>`. Refresh token is stored in an HttpOnly cookie.

## 6. Postman
Import `postman/SpendWise.postman_collection.json`. Set collection variable `baseUrl` to `http://localhost:5000/api`. Register or login first; copy the returned accessToken into `accessToken` variable for protected calls. Refresh/logout use the Postman cookie jar.

## Capstone checklist
MVC folders; .env configuration; bcrypt password hashing; JWT access + refresh tokens; protected routes; role-based admin routes; Mongoose validation and references; aggregation; indexes; centralized error handler; React Router, controlled forms and Context API; Postman collection.

## Notes
This is an academic starter implementation. Before public production deployment, add automated tests, stronger input validation, CSRF protection appropriate to your cookie strategy, refresh-token rotation/reuse detection, audit logging, and deployment-specific cookie/CORS configuration.
