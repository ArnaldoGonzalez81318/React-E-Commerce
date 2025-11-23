# React E-Commerce Platform

Modern storefront + admin command center + Node.js API in a single repository. The frontend offers a curated shopping experience with polished merchandising flows, the admin app manages catalog CRUD, and the backend exposes REST + file uploads backed by MongoDB.

## Apps at a Glance

- `frontend/` – customer-facing React (CRA) application with modernized UI components and cart context logic.
- `admin/` – Vite-powered dashboard for catalog operations, built with Tailwind CSS v4 utilities and React Router.
- `backend/` – Express + MongoDB API providing product, user, cart, and media upload endpoints.

Each folder now ships with its own README if you need feature-specific details or scripts.

## Tech Stack

- React 18, React Router 6, Context API
- Tailwind CSS v4 (admin + shared design tokens), custom CSS modules (frontend)
- Vite 5 (admin) and Create React App 5 (frontend)
- Node.js 18+, Express 4, MongoDB via Mongoose 8, Multer uploads, JWT auth

## Project Structure

```text
.
├── admin/        # Vite + Tailwind admin dashboard
├── backend/      # Express API + MongoDB models and routes
├── frontend/     # Customer storefront built with CRA
├── LICENSE
└── README.md
```

## Prerequisites

- Node.js ≥ 18 and npm ≥ 9
- MongoDB Atlas (or local MongoDB) connection string
- Recommended: separate terminal for each workspace (`frontend`, `backend`, `admin`)

## Environment Variables

Create `backend/.env` with at least:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster/sample
PORT=4000           # optional (defaults to 4000)
JWT_SECRET=replace-me
```

The frontend/admin communicate with the backend at `http://localhost:4000` by default, so update API base URLs if you change the port.

## Install Dependencies

From the repo root run:

```bash
cd backend && npm install
cd ../frontend && npm install
cd ../admin && npm install
```

Or use your preferred package manager per folder.

## Run Everything Locally

| App      | Command                | URL                    |
| -------- | ---------------------- | ---------------------- |
| backend  | `npm run dev`          | <http://localhost:4000> |
| frontend | `npm start`            | <http://localhost:3000> |
| admin    | `npm run dev`          | <http://localhost:5173> |

Start the backend first so media uploads and product APIs are available.

## Useful Scripts

- `frontend`: `npm test`, `npm run build`
- `admin`: `npm run lint`, `npm run build`, `npm run preview`
- `backend`: `npm start` (production), `npm run dev` (nodemon with auto-reload)

## Contributing & Next Steps

1. Create a feature branch, make changes, and run the relevant lint/tests listed above.
2. Update documentation when endpoints or flows change (see the folder READMEs for per-app notes).
3. Open a PR describing UX changes, backend migrations, and screenshots/gifs where helpful.

Questions or bugs? File an issue with reproduction steps, screenshots, and the stack trace/log output.
