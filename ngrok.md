# 📡 Local Development with Ngrok

This guide walks you through starting **ngrok**, configuring environment variables, and running the full development stack (Next.js + Convex) for the MBG project.

---

## 1️⃣ Start Ngrok

Open a terminal (or a new tab) and run:

```bash
cd /Users/madearga/Developer/MBG
ngrok http 3005
```

- Ngrok will expose your local server (`http://localhost:3005`) on a public URL.
- **Copy the HTTPS URL** that appears, e.g. `https://b3e885a78fee.ngrok-free.app`.  
  This URL will be used in the next steps.

---

## 2️⃣ Update Environment Variables

### a. `.env.local` (frontend)

```bash
# Replace the placeholder with your ngrok URL
sed -i '' 's|NEXT_PUBLIC_SITE_URL=.*|NEXT_PUBLIC_SITE_URL=https://YOUR-NGROK-URL.ngrok-free.app|' .env.local
```

### b. `convex/.env` (backend)

```bash
sed -i '' 's|NEXT_PUBLIC_SITE_URL=.*|NEXT_PUBLIC_SITE_URL=https://YOUR-NGROK-URL.ngrok-free.app|' convex/.env
```

> **Tip:** If you prefer to edit manually, open the files and set:
> ```env
> NEXT_PUBLIC_SITE_URL=https://YOUR-NGROK-URL.ngrok-free.app
> ```

### c. Sync to Convex Cloud

```bash
pnpm sync
```

This pushes the updated variables to your Convex deployment.

---

## 3️⃣ (Optional) Update OAuth Redirect URIs

If the ngrok URL changed, update the **GitHub** (and Google, if used) OAuth app settings:

- **Homepage URL:** `https://YOUR-NGROK-URL.ngrok-free.app`
- **Authorization callback URL:** `https://YOUR-NGROK-URL.ngrok-free.app/api/auth/callback/github`

> No changes needed for Google if you haven’t configured it yet.

---

## 4️⃣ Run the Development Stack

In a second terminal (or a new tab), start both the Next.js app and Convex backend:

```bash
cd /Users/madearga/Developer/MBG
pnpm dev
```

- `pnpm dev` runs `concurrently 'pnpm dev:app' 'pnpm dev:backend'`.
- The Next.js dev server will be reachable at **http://localhost:3005** and via the ngrok URL you copied.

---

## 5️⃣ Test the App

Open your browser and navigate to the ngrok URL, e.g.:

```
https://b3e885a78fee.ngrok-free.app
```

- Click **“Sign in with GitHub”** (or Google if configured).
- You should be redirected back to the app with a valid session.

---

## 6️⃣ Restarting Ngrok (When Needed)

If you stop ngrok (`Ctrl+C`) and start it again, a **new URL** will be generated.  
Repeat steps **2–5** to update the environment variables and OAuth redirect URIs.

---

### TL;DR Command Summary

```bash
# 1️⃣ Start ngrok
ngrok http 3005

# 2️⃣ Update URLs (replace YOUR-NGROK-URL)
sed -i '' 's|NEXT_PUBLIC_SITE_URL=.*|NEXT_PUBLIC_SITE_URL=https://YOUR-NGROK-URL.ngrok-free.app|' .env.local
sed -i '' 's|NEXT_PUBLIC_SITE_URL=.*|NEXT_PUBLIC_SITE_URL=https://YOUR-NGROK-URL.ngrok-free.app|' convex/.env

# 3️⃣ Sync to Convex
pnpm sync

# 4️⃣ Run dev servers
pnpm dev
```

Happy coding! 🚀
