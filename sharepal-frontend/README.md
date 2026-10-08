# SharePal – Gaming Gadgets on Rent

The UI is unchanged, but application data and user actions are now served through the backend API.

## Run

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Set MONGO_URI in .env
npm run seed
npm start
```

### Frontend
```bash
cd sharepal-gaming-rentals
npm install
cp .env.example .env
npm run dev
```

The frontend uses `VITE_API_URL` (default `http://localhost:5000/api`).

## API
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`
- `GET /api/content`
- `GET /api/interactions/wishlist`
- `POST /api/interactions/wishlist/:id/toggle`
- `POST /api/interactions/products/:id/notify`
- `POST /api/interactions/products/:id/vote`
- `POST /api/interactions/products/:id/rent`

Wishlist and interaction requests use an anonymous client ID in the `x-client-id` header; the data itself is stored in MongoDB.
