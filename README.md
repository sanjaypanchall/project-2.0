# AI-Powered Enterprise ERP: Backend

A beginner-friendly, feature-wise ERP backend built in 20 days (45 minutes per day) by E-Skills Web LLP.
Node.js 22, Express 4, MongoDB (Mongoose 8), JWT auth with RBAC, Redis cache (optional) and Gemini AI agents.

This repo is the final result of the **Backend Teaching Guide (PDF)**. Frontend is a separate volume.

## What it does

Full business lifecycle in one API:

```
Vendor -> Purchase Request -> Approval -> Purchase Order -> GRN (stock IN)
Customer -> Quotation -> Confirm (stock reserved) -> Invoice -> Payment -> Fulfilment (stock OUT + COGS) -> Sales Return
Expenses / Income -> Profit & Loss -> Dashboard -> AI agents
```

## Features (one module per feature)

| Day   | Module (`src/modules/...`)     | What it gives you                                                          |
| ----- | ------------------------------ | -------------------------------------------------------------------------- |
| 1     | `health`, `index.js`           | Server, MongoDB, error handling, module auto-loader                        |
| 2-3   | `auth`                         | Login, JWT access + refresh rotation, sessions, password reset             |
| 4     | `users`                        | 9 roles, permissions (`area.action`), user management                      |
| 5     | `audit`                        | Every request logged (secrets redacted), login activity                    |
| 6     | `organization`                 | Settings, branches, departments, warehouses                                |
| 7     | `customers`                    | CRM: status pipeline, interactions, follow-ups                             |
| 8     | `products`                     | Categories, SKU, prices in paise                                           |
| 9-10  | `stock`                        | Stock levels + ledger, adjust, transfer, reserve, low stock, valuation     |
| 11    | `approvals`, `notifications`   | Approval engine (handler registry), in-app notifications                   |
| 12    | `vendors`, `purchase-requests` | Vendors, PR with approval                                                  |
| 13    | `purchase-orders`              | PO, GRN (stock IN + average cost), vendor payments                         |
| 14    | `sales-orders`                 | Quotation, tax lines, confirm with reservation                             |
| 15    | `invoices`                     | Invoice, partial payments, outstanding, reconcile                          |
| 16    | `fulfilment`, `sales-returns`  | Deliver (COGS), returns with restock                                       |
| 17    | `finance`                      | Expenses (with approval), income, categories                               |
| 18    | `reports`                      | P&L (monthly, quarterly, yearly, branch, compare), cached dashboard        |
| 19-20 | `ai`                           | Gemini tool-calling, orchestrator + 6 agents, draft-only purchase requests |

New feature = new folder with `<name>.routes.js` exporting `path` and a router. `modules/index.js` loads it automatically.

## Quick start

Requirements: Node.js 22, a MongoDB Atlas cluster (free tier is fine). Redis and a Gemini key are optional.

```bash
npm install
cp .env.example .env      # then fill the values below
npm run seed              # demo data (safe to run again)
npm run dev               # http://localhost:5000/api/health
```

Seed creates: `admin@erp.local` / `Admin@12345`, branch `MAIN`, warehouse `WH1`, 3 products with stock, a customer, a vendor and expense categories.

> Change the admin password before using this anywhere real.

### Environment variables

| Variable               | Required | Notes                                                   |
| ---------------------- | -------- | ------------------------------------------------------- |
| `MONGO_URI`            | yes      | Atlas connection string (add your IP in Network Access) |
| `JWT_ACCESS_SECRET`    | yes      | Long random string (32+ chars)                          |
| `JWT_REFRESH_SECRET`   | yes      | Different long random string                            |
| `PORT`                 | no       | Default 5000                                            |
| `ACCESS_TOKEN_MINUTES` | no       | Default 15                                              |
| `REFRESH_TOKEN_DAYS`   | no       | Default 7                                               |
| `REDIS_URL`            | no       | Dashboard cache. App works without Redis                |
| `GEMINI_API_KEY`       | for AI   | Google AI Studio key                                    |
| `GEMINI_MODEL`         | for AI   | Model name, set in `.env.example`                       |

### Docker

```bash
docker compose up --build -d          # api + redis
docker compose exec api node src/scripts/seed.js
```

Compose reads `.env` and points the API to the `redis` container.

## Rules used across the project

- **Money is in paise (integers).** Rs.100 = `10000`. Floats are rejected.
- **Response shape:** `{ success, message, data }`. Errors: `{ success: false, message }`.
- **Permissions:** every protected route uses `authorize("area.action")`. Roles and permissions live in `src/config/permissions.js`.
- **Stock changes only through `stock.service.js`**, so the ledger always matches the levels. Updates are atomic (no transactions needed).
- **Revenue and COGS are both recognised at fulfilment**, so profit is correct per period.
- **AI is draft-only.** It can read data and create a _draft_ purchase request. Humans submit and approve.

## API overview

Base URL `/api`. Send `Authorization: Bearer <accessToken>` on protected routes.

`/health` `/auth` `/users` `/audit` `/org` `/customers` `/products` `/stock` `/notifications` `/approvals` `/vendors` `/purchase-requests` `/purchase-orders` `/sales-orders` `/invoices` `/fulfilment` `/sales-returns` `/finance` `/reports` `/ai`

The full route list with permissions is in **Appendix B** of the PDF.

### Try the full flow (Postman or Thunder Client)

1. `POST /auth/login` with the seed admin, then use the `accessToken`.
2. Create a purchase request, submit it, approve it (`/approvals/:id/approve`).
3. Create a PO from it and receive goods (`/purchase-orders/:id/receive`).
4. Create a sales order, confirm, invoice, pay, fulfil.
5. `GET /reports/pnl` and match the numbers by hand.
6. `POST /ai/chat` with `{ "message": "Is mahine ka profit kitna hai?" }`.

Appendix C of the PDF has the complete 20-step scenario.

## Project structure

```
src/
  app.js, server.js
  config/        env, db, permissions, constants
  middleware/    authenticate, authorize, errorHandler, notFound
  utils/         ApiError, asyncHandler, respond, validate, money, query, crud, counter, cache
  modules/       one folder per feature (see table above)
  scripts/       seed.js
```

## Testing status

Syntax, app boot, permissions, P&L formula, Redis cache and the AI agent loop (with a mocked Gemini) were checked.
The database-backed routes should be verified against your own MongoDB using the Postman checklist in each PDF chapter.

## Changing a feature later

Each PDF chapter has a **Revision Log**. Edit only that feature's module folder, then record the change (version, date, what changed).

## Not included (on purpose)

HRM, document RAG, leads/deals, realtime sockets and job queues. For real production use also add rate limiting, structured logging and monitoring, CI/CD and backups.

---

Built by E-Skills Web LLP as a teaching project.
