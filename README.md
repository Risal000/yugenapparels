# Yūgen Apparels

Minimal streetwear e-commerce site built with React + Vite + Supabase + Vercel.

## Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend/DB**: Supabase (PostgreSQL + Storage)
- **Hosting**: Vercel

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Add environment variables
Copy `.env.example` to `.env` and fill in your Supabase credentials:
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run locally
```bash
npm run dev
```

### 4. Build for production
```bash
npm run build
```

## Deploy to Vercel
1. Push this repo to GitHub
2. Go to vercel.com → New Project → Import repo
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Click Deploy

## Admin Access
Go to `/admin` → triple-tap the logo, or navigate directly.
- Email: yugen7953@gmail.com
- Password: Yugen@Admin2024

## Database Schema
Run the SQL in `supabase-schema.sql` in your Supabase SQL editor.
