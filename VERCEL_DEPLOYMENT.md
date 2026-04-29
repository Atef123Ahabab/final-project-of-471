# 🚀 MANUAL VERCEL DEPLOYMENT (Recommended - No CLI Needed)

Your project is **100% ready**. Deploy in 5 minutes via Vercel Web UI.

---

## **STEP 1: Push to GitHub**

Run these commands in your terminal:

```bash
cd /Users/atefahabab/Downloads/471-2-features-merge-ready

# Add GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/resume-portal.git
git branch -M main
git push -u origin main
```

**First time?** Create a free GitHub account: https://github.com/signup

---

## **STEP 2: Deploy to Vercel (3 minutes)**

1. Go to: **https://vercel.com/new**
2. Click **"Import Git Repository"**
3. Paste your GitHub repo URL:
   ```
   https://github.com/YOUR_USERNAME/resume-portal.git
   ```
4. Click **"Import"**
5. Select your GitHub account and click **"Continue"**

---

## **STEP 3: Configure Project Settings**

On the "Configure Project" page:

- **Framework Preset**: `Vite` (auto-detected)
- **Root Directory**: Leave blank (or select `.`)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

Click **"Deploy"** (this will deploy but fail initially - that's OK)

---

## **STEP 4: Add Environment Variables**

After deployment starts, you'll see a message "Environment Variables not set". 

1. Go to your Vercel project page
2. Click **"Settings"** → **"Environment Variables"**
3. Add these variables exactly:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | `mongodb://ibrahimisfar_db_user:hedasudir@ac-5yf19ok-shard-00-00.4xgqkqt.mongodb.net:27017,ac-5yf19ok-shard-00-01.4xgqkqt.mongodb.net:27017,ac-5yf19ok-shard-00-02.4xgqkqt.mongodb.net:27017/resume-job-portal?tls=true&replicaSet=atlas-z6svrs-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0` |
| `JWT_SECRET` | `change-this-jwt-secret` |
| `ADMIN_EMAIL` | `ahababatef14@gmail.com` |
| `ADMIN_PASSWORD` | `admin12345` |
| `ADZUNA_APP_ID` | `30b3f865` |
| `ADZUNA_APP_KEY` | `46ecdf42bed868930056cfd1685ba5a7` |
| `NODE_ENV` | `production` |

4. Click **"Save"**

---

## **STEP 5: Redeploy**

Back on the Deployments page:

1. Click the **three dots (⋯)** next to the latest deployment
2. Select **"Redeploy"**
3. Click **"Redeploy"** again to confirm

Wait 2-3 minutes for the build to complete.

---

## ✅ Your Live URL

Once deployment succeeds, Vercel shows you:

```
https://resume-portal.vercel.app
(or similar - check your Vercel dashboard)
```

---

## 🧪 Test Your Deployment

```bash
# Test health check
curl https://resume-portal.vercel.app/api/health

# Test admin login
curl -X POST https://resume-portal.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ahababatef14@gmail.com","password":"admin12345"}'
```

---

## 🎯 What's Live

✅ Frontend - React app (all pages: jobs, fraud detection, resumes)  
✅ Backend - Node.js API (all endpoints: /api/jobs, /api/admin, /api/audit-logs, etc.)  
✅ Database - MongoDB Atlas (already connected)  

---

## 🔐 Security (Before Sharing)

⚠️ Change in Vercel Environment Variables:
- Set `JWT_SECRET` to a random string (e.g., `xyz123abc456def789xyz`)
- Set `ADMIN_PASSWORD` to a strong password
- Don't share `.env` file publicly

---

## 🆘 Troubleshooting

**Deployment failed?**
- Check build logs: Vercel dashboard → Deployments → Click failed build → See logs
- Common issue: Missing Node version - add `18.x` to package.json

**API returns 500?**
- Verify all 7 environment variables are set
- Check MongoDB connection: MongoDB Atlas → Network Access → Allow Vercel IPs

**Frontend shows blank?**
- Clear cache: Ctrl+Shift+Del → Clear All
- Reload: Ctrl+R

**Need help?**
- Vercel docs: https://vercel.com/docs
- MongoDB docs: https://docs.mongodb.com/

---

## 📊 Monitoring

Track your app's performance:
- Vercel Analytics: https://vercel.com/dashboard → Your Project → Analytics
- Deployment history: https://vercel.com/dashboard → Your Project → Deployments

---

**That's it! Your production app is live in 5 minutes.** 🎉

Next: Share your Vercel URL with anyone to access the portal!

