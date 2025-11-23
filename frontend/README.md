# Storefront (frontend)

Create React App storefront that powers the public shopping experience: hero landing, curated collections, product detail, cart, and authentication flows. Styling combines the global design tokens in `src/App.css` with per-component CSS modules for detailed layouts.

## Highlights

- Home page with Trending, Offers, New Collections, Newsletter, and curated marketing rows
- Category views (men, women, kids) powered by shared `ShopCategory` logic
- Product detail with gallery, description box, reviews placeholder, and related products
- Cart context handles quantity management, promo messaging, shipping selection, and recommendations
- Login/Signup split layout with validation, stateful feedback, and social CTAs

## Requirements

- Node.js 18+
- Backend API running locally at `http://localhost:4000`

## API Configuration

All data-fetching URLs live inside `src/Context/shopContext.jsx`. Update the `fetch('http://localhost:4000/...')` calls (or extract a constant) if your backend runs on a different host/port.

## Scripts

| Command         | Description                                           |
| --------------- | ----------------------------------------------------- |
| `npm start`     | Start CRA dev server at <http://localhost:3000>       |
| `npm test`      | Run Jest + Testing Library in watch mode              |
| `npm run build` | Create a production build in `build/`                 |
| `npm run eject` | Permanently copy CRA configs (not recommended)        |

## Getting Started

```bash
cd frontend
npm install
npm start
```

The CRA dev server proxies API requests directly to the backend URL you configure in the context. Ensure the backend is running so product, cart, and auth calls succeed.

## Testing & Linting

- Component tests: `npm test`
- Web vitals reporting lives in `src/reportWebVitals.js` if you need performance hooks

## Build & Deploy

1. Run `npm run build`
2. Deploy the generated `build/` directory to your static host (Netlify, Vercel, S3, etc.)
3. Make sure environment-specific API URLs are updated before shipping
