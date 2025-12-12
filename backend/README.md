# Skillify Backend

Express + Prisma backend for Skillify mentorship platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp env.example .env
# Edit .env with your database credentials
```

3. Generate Prisma client:
```bash
npm run prisma:generate
```

4. Push database schema:
```bash
npm run prisma:push
```

## Development

```bash
npm run dev
```

## Production

```bash
npm start
```

## API Endpoints

### Auth
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login
- `POST /auth/logout` - Logout
- `GET /auth/me` - Get current user (protected)

### Mentors
- `GET /mentors` - List mentors with filters
- `GET /mentors/:id` - Get mentor by ID
- `GET /mentors/profile` - Get current mentor's profile (protected)
- `PUT /mentors/profile` - Update mentor profile (protected)

### Sessions
- `POST /sessions` - Book a session (protected)
- `GET /sessions` - Get user's sessions (protected)
- `GET /sessions/:id` - Get session by ID (protected)

## Deployment (Render)

1. Build Command: `npm install && npx prisma generate`
2. Start Command: `node src/index.js`
3. Environment Variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `FRONTEND_URL`
   - `NODE_ENV=production`
