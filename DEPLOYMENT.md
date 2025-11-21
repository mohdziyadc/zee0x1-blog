# Railway Deployment Guide for TanStack Start

This guide follows the [official TanStack Start hosting documentation](https://tanstack.com/start/latest/docs/framework/react/guide/hosting) for deploying to Railway.

## 📦 Prerequisites

1. Railway account
2. PostgreSQL database provisioned in Railway
3. Google OAuth credentials from Google Cloud Console
4. This repository pushed to GitHub

## 🚀 Deployment Steps

### 1. Install Nitro (Locally)

```bash
npm install -D nitro
```

Nitro is the official deployment adapter recommended by TanStack Start for Node.js environments like Railway.

### 2. Configuration Files

The following files have been configured for Railway deployment:

**vite.config.ts** - Includes Nitro plugin with `node-server` preset
**package.json** - Build and start scripts configured:
- `npm run build` → Builds the application to `.output/`
- `npm run start` → Starts the production server

### 3. Set Up Railway Project

1. Go to [Railway](https://railway.app) and create a new project
2. Choose "Deploy from GitHub repo" and select your repository
3. Add a PostgreSQL database to your project (Railway will auto-provide `DATABASE_URL`)

### 4. Configure Environment Variables

In Railway Dashboard → Variables, add:

```bash
# Database (Auto-provided by Railway PostgreSQL service)
DATABASE_URL=postgresql://...

# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Better Auth Secret (generate with: openssl rand -base64 32)
BETTER_AUTH_SECRET=your-generated-secret-here

# Your deployed domain
BETTER_AUTH_URL=https://zee0x1.com

# Environment
NODE_ENV=production
```

#### Generate BETTER_AUTH_SECRET

Run locally:
```bash
openssl rand -base64 32
```

### 5. Configure Build Settings in Railway

Railway should auto-detect the configuration, but verify:

- **Build Command**: `npm run build`
- **Start Command**: `npm run start`
- **Root Directory**: `/` (or leave empty)

### 6. Configure Google OAuth

In [Google Cloud Console](https://console.cloud.google.com/apis/credentials):

1. Go to your OAuth 2.0 Client ID
2. Add to **Authorized redirect URIs**:
   ```
   https://zee0x1.com/api/auth/callback/google
   https://*.railway.app/api/auth/callback/google
   ```
3. Add to **Authorized JavaScript origins**:
   ```
   https://zee0x1.com
   https://*.railway.app
   ```

### 7. Deploy

Push your code to GitHub:

```bash
git add .
git commit -m "Configure for Railway deployment with Nitro"
git push
```

Railway will automatically:
1. Detect the changes
2. Run `npm install`
3. Run `npm run build`
4. Start the server with `npm run start`

### 8. Run Database Migrations

After first successful deployment, run in Railway's terminal:

```bash
npm run db:push
```

This will apply your Drizzle schema to the PostgreSQL database.

### 9. Custom Domain Setup

1. In Railway Dashboard → Settings → Domains
2. Click "Custom Domain"
3. Add `zee0x1.com`
4. Update your DNS records as instructed by Railway
5. Update `BETTER_AUTH_URL` environment variable to your custom domain

## 🔍 Troubleshooting

### Build Fails

**Check logs** in Railway Dashboard → Deployments → View Logs

Common issues:
- Missing `nitro` in devDependencies → Run `npm install -D nitro` locally and push
- TypeScript errors → Run `npm run build` locally first to catch errors

### "Not Found" Page

If you see Railway's 404 page:

1. ✅ Verify build completed successfully (check deploy logs)
2. ✅ Confirm start command is `npm run start` (not `npm run serve`)
3. ✅ Check that `.output/server/index.mjs` exists after build
4. ✅ Review runtime logs for errors

### Database Connection Errors

- Verify `DATABASE_URL` is set correctly in Railway variables
- Ensure PostgreSQL service is running
- Check that migrations were run with `npm run db:push`
- Verify SSL is configured correctly (Railway Postgres uses SSL by default)

### Google OAuth Not Working

- Double-check redirect URIs in Google Console match your domain exactly
- Verify `BETTER_AUTH_URL` matches your actual deployed domain
- Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
- Clear browser cookies and try again

### Application Crashes on Start

Check Railway logs for:
- Missing environment variables
- Database connection timeouts
- Port binding issues (Railway sets PORT automatically)

## 📊 Post-Deployment Checklist

After deployment, verify:

- [ ] Homepage loads at `https://zee0x1.com`
- [ ] Admin page accessible at `https://zee0x1.com/admin`
- [ ] Google OAuth login works
- [ ] Can create and edit blog posts
- [ ] Published blogs visible on homepage
- [ ] Database queries working correctly

## 🎯 Production Optimization

### Recommended Railway Settings

- **Memory**: 512MB minimum (1GB recommended for better performance)
- **Region**: Choose closest to your target audience
- **Restart Policy**: Always restart on failure
- **Health Checks**: Railway auto-monitors by default

### Monitoring

Set up monitoring with:
- Railway built-in metrics (CPU, Memory, Network)
- External uptime monitor (UptimeRobot, Better Uptime)
- Error tracking (Sentry - recommended)

## 🔄 Updating Your Deployment

To deploy changes:

```bash
git add .
git commit -m "Your changes"
git push
```

Railway automatically redeploys on every push to your main branch.

## 📚 Additional Resources

- [TanStack Start Hosting Docs](https://tanstack.com/start/latest/docs/framework/react/guide/hosting)
- [Railway Documentation](https://docs.railway.app/)
- [Nitro Documentation](https://nitro.unjs.io/)
- [Better Auth Documentation](https://www.better-auth.com/docs)

## 🆘 Getting Help

If you encounter issues:

1. Check Railway deployment logs
2. Review this guide's troubleshooting section
3. Consult TanStack Start documentation
4. Ask in [TanStack Discord](https://discord.com/invite/tanstack)

