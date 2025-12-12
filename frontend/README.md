# Skillify Frontend

Next.js 14 frontend for Skillify mentorship platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp env.local.example .env.local
# Edit .env.local with your backend URL
```

3. Run development server:
```bash
npm run dev
```

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:5000)

## Deployment (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Set environment variable:
   - `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com`
4. Deploy

## Features

- Modern purple-themed UI
- Responsive design
- Client-side routing
- Centralized API client
- Auth state management with Zustand
- Protected routes
