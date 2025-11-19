# 🔄 Ngrok URL Update Guide

Since Ngrok URLs change every time you restart the ngrok process (unless you have a paid static domain), you need to update your project configuration whenever you get a new URL.

We have provided a script to automate this process.

## 🚀 How to Use the Update Script

### 1. Start Ngrok
Run ngrok in a terminal:
```bash
ngrok http 3005
```
Copy the new HTTPS URL (e.g., `https://a1b2c3d4.ngrok-free.app`).

### 2. Run the Updater Script
In another terminal window (inside your project root), run:

```bash
./update-ngrok-url.sh
```

Paste your new URL when prompted.

**OR** pass the URL directly as an argument:

```bash
./update-ngrok-url.sh https://a1b2c3d4.ngrok-free.app
```

### 3. What the Script Does
1. Updates `NEXT_PUBLIC_SITE_URL` in `.env.local`.
2. Updates `NEXT_PUBLIC_SITE_URL` in `convex/.env`.
3. Runs `pnpm sync` to push the new environment variables to your Convex Cloud deployment.

### 4. Final Manual Step (Required)
After running the script, you **MUST** manually update your OAuth Provider settings (GitHub/Google):

1. **Homepage URL**: `https://YOUR-NEW-URL.ngrok-free.app`
2. **Callback URL**: `https://YOUR-NEW-URL.ngrok-free.app/api/auth/callback/github`

---

## 📝 Troubleshooting

- **Permission Denied?**
  If you can't run the script, make it executable:
  ```bash
  chmod +x update-ngrok-url.sh
  ```

- **Convex Sync Failed?**
  Ensure you are logged in to Convex (`npx convex login`) and have internet access.
