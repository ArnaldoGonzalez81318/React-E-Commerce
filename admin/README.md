# Admin Dashboard

Vite + React admin surface for merchandising and inventory management. It connects to the Express API to upload product media, create listings, and review the product catalog used by the customer storefront.

## Features

- Add products with validation, hero image preview, and availability toggles
- View the product list in a responsive grid with quick actions
- Navigate between catalog views using the sticky navbar with status indicators
- Tailwind CSS v4 utility styling with shared gradient/theming tokens

## Requirements

- Node.js 18+
- Backend API running locally at `http://localhost:4000` (required for uploads and CRUD)

## Scripts

| Command           | Description                             |
| ----------------- | --------------------------------------- |
| `npm run dev`     | Start Vite dev server with hot reloading |
| `npm run build`   | Create a production build in `dist/`     |
| `npm run lint`    | Run ESLint with the repo ruleset         |
| `npm run preview` | Preview the production build locally     |

## Development Notes

1. Install dependencies: `npm install`
2. Create `backend/.env` and start the backend with `npm run dev`
3. From `admin/`, run `npm run dev` and open the Vite URL in the terminal (usually <http://localhost:5173>)
4. API targets are pointing to `http://localhost:4000`. Update the fetch URLs in `src/Components` if your backend lives somewhere else.

## Project Structure (high level)

```text
admin/
├── public/
├── src/
│   ├── Components/
│   │   ├── AddProduct/
│   │   ├── Navbar/
│   │   ├── ProductList/
│   │   └── Sidebar/
│   └── Pages/
└── vite.config.js
```

The admin UI assumes the same product schema as the backend (`name`, `image`, `category`, `old_price`, `new_price`, `description`, `available`). When adding new fields remember to update both the backend models and these forms.
