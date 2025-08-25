# Roxlier Backend (Node.js + Express + Prisma)

A TypeScript Express API using Prisma (PostgreSQL), JWT auth, Zod validation, and role-based middleware for users, stores, ratings, and simple admin analytics.

## Tech Stack
- Node.js, TypeScript, Express 5
- Prisma ORM (`@prisma/client`) with PostgreSQL
- Zod for request validation
- JWT for auth, bcryptjs for password hashing
- CORS, dotenv

## Getting Started
1. Install dependencies
```bash
npm install
```
2. Environment variables (create `.env` in project root)
```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB?schema=public"
JWT_SECRET="a-strong-secret"
PORT=3000
NODE_ENV=development
```
3. Generate Prisma client and build
```bash
npm run generate
npm run build
```
4. Run the server
```bash
npm run start
# or during development (build then run)
npm run dev
```
Server starts at `http://localhost:3000` by default.

## Project Structure
```
be/
  prisma/
    schema.prisma              # DB schema (user, store, Rating)
  src/
    index.ts                   # Express app entry
    controller/                # Route handlers
    middleware/                # Auth middlewares
    routes/                    # Route definitions
  generated/prisma/            # Prisma client output
  vercel.json                  # Vercel config (optional)
```

## Database Schema (Prisma)
- `role` enum: `systemAdmin | user | storeOwner`
- `user`:
  - `id (cuid)`, `userName`, `userEmail (unique)`, `userPassword`, `userRole`, `userAddress`
  - relations: `stores` (owned stores), `ratings`
- `store`:
  - `id (uuid)`, `storeName`, `storeAddress`, `averageRating` (Float, default 0), `ratingCount` (Int, default 0)
  - `storeOwnerId` → `user(id)`
- `Rating`:
  - `id (uuid)`, `rating (Int)`, `storeId`, `userId`
  - unique composite: `@@unique([storeId, userId])`

## Authentication & Middleware
JWT is expected in `Authorization: Bearer <token>`.

- `userAuthValidation` (`src/middleware/userAuth/userAuth.middleware.ts`)
  - Allows `user`, `storeOwner`, or `systemAdmin`.
  - Attaches decoded token to `req.user`.
- `storeAuthValidation` (`src/middleware/storeAuth/storeAuth.middleware.ts`)
  - Intended to allow `storeOwner` or `systemAdmin`.
  - Note: the condition `if (role === "storeOwner" || "systemAdmin")` always passes; should be `if (role === "storeOwner" || role === "systemAdmin")`.
- `systemAdminAuthValidation` (`src/middleware/systemAdmin/systemAdmin.middlewarte.ts`)
  - Allows only `systemAdmin`.

Tokens are generated in:
- `auth.controller.ts`: `signIn`, `signUp` (30d/30days expiry). Cookies are also set for browsers.

## Base URL and Health
- `GET /` → `{ message: "Welcome to developer challange api" }`
- API prefix: `/api/v1`

## Routes
Below, each section lists the path prefix and endpoints. Required auth middleware is marked.

### Auth (`/api/v1/auth`)
- `POST /signin`
  - Body: `{ userEmail, userPassword }`
  - Response: `{ message, token, user }`
- `POST /signup`
  - Body: `{ userName, userEmail, userPassword, userAddress }`
  - Response: `{ message, newUser, token }`
- `PUT /update-password` [userAuthValidation]
  - Body: `{ currentPassword, newPassword, userId }`
  - Response: `{ message }`

### Users (`/api/v1/user`)
- `GET /hello` [userAuthValidation]
  - Returns auth test payload and `req.user`.
- `POST /adduser` [systemAdminAuthValidation]
  - Body: `{ userName, userEmail, userPassword, userAddress, role }`
- `GET /get-user/:userrole` [systemAdminAuthValidation]
  - `userrole`: one of `systemAdmin|user|storeOwner`.
- `GET /getuser/:userid` [systemAdminAuthValidation]
- `GET /total-users` [userAuthValidation]
- `GET /get-all-user` [systemAdminAuthValidation]

### Stores (`/api/v1/store`)
- `POST /create` [storeAuthValidation]
  - Body: `{ storeName, storeAddress, storeOwnerId }`
- `GET /all-stores`
- `GET /get-store/:storeid` [systemAdminAuthValidation]
- `GET /store-cont` [systemAdminAuthValidation]

### Ratings (`/api/v1/rating`)
- `GET /all`
- `POST /create` [userAuthValidation]
  - Body: `{ rating (<=5), storeId, userId }`
  - On create: updates store `averageRating` and `ratingCount`.

### Dashboard (`/api/v1/dashboard`)
- `GET /analytics` [systemAdminAuthValidation]
  - Returns counts for users, stores, ratings.
- `GET /data` [systemAdminAuthValidation]
  - Returns selected user and store datasets.

## Validation
- Zod schemas enforce payloads in controllers.
- Common patterns:
  - Email must be valid.
  - Passwords: min 8 chars, uppercase, lowercase, digit, special char.
  - Names and addresses have reasonable length constraints.

## Error Handling
- Consistent `4xx` on validation/auth errors, `5xx` on unexpected failures.
- Message fields describe the error; some endpoints include `error: err.message`.

## Deployment
- `vercel.json` configured to route all traffic to `src/index.ts` using `@vercel/node`.

## Notes & Caveats
- Ensure `JWT_SECRET` is set; otherwise auth will fail.
- Prisma client output is configured to `generated/prisma`.
- Typo: route `store-cont` likely means `store-count` (currently returns total stores).
- Middleware bug in `storeAuthValidation` as noted above.
- Some success responses omit data objects; adjust as needed for clients.
