# ONEWAY DROPME

Taxi booking site (Next.js) with transparent fares and a 4-step booking flow.

**Live demo:** deploy on [Render](https://render.com) (see below) — share the `*.onrender.com` URL with clients.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy `.env.example` → `.env.local` for Maps, Razorpay, email, etc.

---

## GitHub (`tamizhataxi-alt`)

### 1. Create the repository (one time)

1. Sign in at [github.com/tamizhataxi-alt](https://github.com/tamizhataxi-alt).
2. **New repository**
   - Name: `oneway-dropme` (or `dropme`)
   - **Public** (easier for Render free tier and client links)
   - Do **not** add README, `.gitignore`, or license (this project already has them).
3. Create repository.

### 2. Push this project from your PC

In PowerShell (project folder `D:\Dropme`):

```powershell
cd D:\Dropme
git add -A
git commit -m "Initial commit: ONEWAY DROPME site"
git remote add origin https://github.com/tamizhataxi-alt/oneway-dropme.git
git push -u origin main
```

Use your GitHub username/password or a **Personal Access Token** when Git asks for credentials.

> Never commit `.env` or `.env.local` — they stay on your machine and in Render’s dashboard only.

---

## Deploy on Render (client preview URL)

### Option A — Manual (recommended first time)

1. [dashboard.render.com](https://dashboard.render.com) → sign up / log in (GitHub login works).
2. **New +** → **Web Service**.
3. Connect **GitHub** and select `tamizhataxi-alt/oneway-dropme`.
4. Settings:

   | Field | Value |
   |--------|--------|
   | **Name** | `oneway-dropme` |
   | **Region** | Singapore (closest to Tamil Nadu) |
   | **Branch** | `main` |
   | **Runtime** | Node |
   | **Build Command** | `npm ci && npm run build` |
   | **Start Command** | `npm start` |
   | **Plan** | Free (or Starter for always-on) |

5. **Environment variables** (Environment tab):

   | Key | Value |
   |-----|--------|
   | `NODE_VERSION` | `20` |
   | `NEXT_PUBLIC_SITE_URL` | `https://oneway-dropme.onrender.com` (use your actual Render URL after first deploy) |
   | `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Your Google key (restrict HTTP referrer to `*.onrender.com` and your domain) |
   | `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Test keys for demo, live keys for production |
   | `RESEND_API_KEY` | Optional — booking emails |
   | `BOOKING_EMAIL_TO` | `dropme@gmail.com` |

6. **Create Web Service** — first deploy takes ~5–10 minutes.
7. Share **`https://<your-service>.onrender.com`** with your client.

**Free tier:** the app sleeps after ~15 minutes idle; the first visit may take 30–60 seconds to wake up.

### Option B — Blueprint

After the repo is on GitHub, **New +** → **Blueprint** → select the repo (uses `render.yaml` in the root).

Set secret env vars in the Render dashboard when prompted.

---

## After you connect `onewaydropme.com` (Hostinger)

1. In Render: **Settings → Custom Domains** → add `onewaydropme.com` and `www`.
2. At Hostinger DNS, add the **CNAME / A records** Render shows.
3. Update `NEXT_PUBLIC_SITE_URL` to `https://onewaydropme.com` and redeploy.

---

## Environment reference

| Feature | Variables |
|--------|-----------|
| Google Maps distance + Places | `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` |
| Razorpay | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` |
| Resend email | `RESEND_API_KEY`, `BOOKING_EMAIL_TO`, `BOOKING_EMAIL_FROM` |
| WhatsApp Cloud API | `WHATSAPP_*` |
| Booking ID floor | `BOOKING_ID_COUNTER` |

Without optional keys, booking still works with **Pay at Drop**; distance can use the route table.

## Brand

- Phone: **8939390101**
- Email: **dropme@gmail.com**
- Logo: `public/logo.jpg`
