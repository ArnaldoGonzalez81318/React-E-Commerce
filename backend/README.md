# Backend API

Express + MongoDB service that powers the storefront and admin dashboards. It exposes product, user, cart, and media upload endpoints and stores data with Mongoose models.

## Requirements

- Node.js 18+
- MongoDB Atlas or local MongoDB instance

## Environment Variables

Create `backend/.env` with:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster/sample
PORT=4000
JWT_SECRET=replace-me
```

`PORT` defaults to `4000` when omitted. Update the frontend/admin fetch URLs if you change it.

## Scripts

| Command       | Description                               |
| ------------- | ----------------------------------------- |
| `npm install` | Install dependencies                      |
| `npm run dev` | Start server with nodemon + hot reload     |
| `npm start`   | Start server with Node (production mode)   |

## Core Endpoints

| Method | Path                        | Notes                                          |
| ------ | --------------------------- | ---------------------------------------------- |
| POST   | `/upload`                   | Accepts `productImage` file via Multer         |
| POST   | `/add-product`              | Create a new product document                  |
| GET    | `/all-products` or `/products` | Fetch catalog for storefront                |
| POST   | `/remove-product`           | Delete a product by id                         |
| POST   | `/signup` / `/login`        | Basic user auth returning JWT                  |
| GET    | `/cart`                     | Retrieve user cart (requires `Authorization`)  |
| POST   | `/add-to-cart`              | Increment quantity                             |
| POST   | `/remove-from-cart`         | Decrement quantity                             |
| POST   | `/remove-product-from-cart` | Remove product entirely                        |

_All routes are registered in `server.js` via the modules in `routes/`._

## Folder Overview

```text
backend/
├── models/      # Product and User mongoose schemas
├── routes/      # Product, user, and cart routers
├── upload/      # Uploaded images (gitignored)
└── server.js    # Express entry point
```

## Development Tips

- Keep `upload/` in `.gitignore`; assets are generated per environment.
- When adding new routes, export them from `routes/*.js` and mount them in `server.js`.
- Re-run `npm run dev` after updating environment variables.
