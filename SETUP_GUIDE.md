# Yūgen Apparels — Setup Guide
## From base44 → Supabase + Vercel (Free, Fully Owned)

---

## What changed

| Before (base44) | After (yours) |
|---|---|
| base44 database | Supabase PostgreSQL |
| base44 auth | Simple password admin gate |
| base44 file storage | Supabase Storage |
| base44 hosting | Vercel |
| Cart/Wishlist in base44 | Cart/Wishlist in localStorage (no login needed) |

Everything looks and works **exactly the same** for customers.

---

## Step 1 — Create a Supabase account

1. Go to **https://supabase.com** → click **Start for Free**
2. Sign up (GitHub login is easiest)
3. Click **New Project**
4. Fill in:
   - **Name:** yugen-apparels
   - **Database Password:** (save this somewhere!)
   - **Region:** pick the closest to India (ap-south-1 / Singapore)
5. Click **Create new project** — wait ~2 minutes

---

## Step 2 — Set up the database

1. In your Supabase project, click **SQL Editor** in the left sidebar
2. Click **New query**
3. Open the file `supabase/schema.sql` from this project
4. Copy all its contents and paste into the SQL Editor
5. Click **Run** (green button)
6. You should see "Success" — your tables are created!

---

## Step 3 — Create the image storage bucket

1. In Supabase, click **Storage** in the left sidebar
2. Click **New bucket**
3. Name it exactly: `product-images`
4. Check **Public bucket** ✓
5. Click **Save**
6. Click on the bucket → **Policies** tab → **New policy** → **For full customization**
7. Add these two policies:

**Policy 1 (anyone can upload):**
- Policy name: `allow_uploads`
- Allowed operation: INSERT
- Target roles: Leave blank (public)
- USING expression: `true`
- WITH CHECK expression: `true`

**Policy 2 (public read):**
- Policy name: `public_read`
- Allowed operation: SELECT
- WITH CHECK: `true`

---

## Step 4 — Get your Supabase keys

1. In Supabase, click **Project Settings** (gear icon) → **API**
2. Copy:
   - **Project URL** (looks like: `https://abcdefg.supabase.co`)
   - **anon public** key (long string under "Project API keys")

---

## Step 5 — Create a Vercel account

1. Go to **https://vercel.com** → Sign up (GitHub login recommended)
2. On the dashboard, click **Add New → Project**
3. Click **Import Git Repository**

---

## Step 6 — Push this code to GitHub

1. Go to **https://github.com** → click **+** → **New repository**
2. Name it `yugen-apparels`, set to **Private**, click **Create repository**
3. Open a terminal on your computer in this project folder and run:

```bash
git init
git add .
git commit -m "Initial commit — Yūgen Apparels"
git remote add origin https://github.com/YOUR_USERNAME/yugen-apparels.git
git push -u origin main
```

---

## Step 7 — Deploy to Vercel

1. Back in Vercel, import your `yugen-apparels` GitHub repo
2. Framework: **Vite** (auto-detected)
3. Click **Environment Variables** and add these 3:

| Name | Value |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase Project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `VITE_ADMIN_PASSWORD` | Choose a strong password for admin |

4. Click **Deploy** — takes ~1 minute
5. Your site is live at `your-project.vercel.app`! 🎉

---

## Step 8 — Add your products

Since your products were in base44, you'll need to re-add them:

1. Go to `your-site.vercel.app/admin`
2. Enter your admin password
3. Click **Products → Add Product**
4. Fill in the details and upload images

**OR** if you want to bulk import, you can insert directly in Supabase:
- Go to Supabase → **Table Editor** → `products` → **Insert rows**

---

## Step 9 — Set up a custom domain (optional)

1. In Vercel dashboard → your project → **Settings → Domains**
2. Add your domain (e.g. `yugenapparels.com`)
3. Follow Vercel's DNS instructions for your domain registrar

---

## Admin access

Go to `/admin` on your site → enter your `VITE_ADMIN_PASSWORD`.
- Triple-tap the "Yūgen" logo also goes to admin (same as before)

---

## How orders work

Customers click **Buy Now** or **Order via WhatsApp** → goes to your WhatsApp.
You manually create an order record in the admin panel after confirming.

---

## Local development

```bash
# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env
# Fill in your Supabase URL, key, and admin password

# 3. Run locally
npm run dev
# Opens at http://localhost:5173
```

---

## Cost

| Service | Cost |
|---|---|
| Supabase | **Free** (up to 500MB DB, 1GB storage) |
| Vercel | **Free** (hobby plan, unlimited sites) |
| Custom domain | ~₹800–1200/year (optional) |

**Total: ₹0/month** (or ~₹100/month if you buy a domain)

