# ✅ DEPLOYMENT CHECKLIST - Resume Portal

## Pre-Deployment Checklist

- [x] Project initialized with Git
- [x] All files committed to local Git repo
- [x] Vercel configuration files created:
  - `vercel.json` (root)
  - `frontend/vercel.json`
  - `backend/api/index.js` (Vercel serverless handler)
- [x] .gitignore configured
- [x] MongoDB Atlas connection ready
- [x] Environment variables documented
- [x] Vercel CLI installed
- [x] Frontend build tested

---

## Deployment Steps (Pick ONE Option)

### **OPTION A: Recommended - Deploy via Vercel CLI (5 mins)**

```bash
cd /Users/atefahabab/Downloads/471-2-features-merge-ready

# First time? Create Vercel account and login
vercel login

# Deploy to production
vercel --prod
```

When prompted:
- "Set up and deploy?" → **Yes**
- "Which scope?" → Select your account
- "Link to existing project?" → **No**
- "Project name?" → `resume-portal` (or your choice)
- "In which directory?" → `.`
- "Override settings?" → **N**

Then add environment variables to Vercel project dashboard and redeploy.

---

### **OPTION B: Manual - Deploy via Vercel Web UI**

See **VERCEL_DEPLOYMENT.md** in this folder for step-by-step instructions.

---

## Environment Variables to Set

Add these in Vercel Dashboard → Project Settings → Environment Variables:

```
MONGODB_URI = mongodb://ibrahimisfar_db_user:hedasudir@ac-5yf19ok-shard-00-00.4xgqkqt.mongodb.net:27017,ac-5yf19ok-shard-00-01.4xgqkqt.mongodb.net:27017,ac-5yf19ok-shard-00-02.4xgqkqt.mongodb.net:27017/resume-job-portal?tls=true&replicaSet=atlas-z6svrs-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0

JWT_SECRET = change-this-jwt-secret

ADMIN_EMAIL = ahababatef14@gmail.com

ADMIN_PASSWORD = admin12345

ADZUNA_APP_ID = 30b3f865

ADZUNA_APP_KEY = 46ecdf42bed868930056cfd1685ba5a7

NODE_ENV = production
```

---

## Testing After Deployment

```bash
# Replace YOURAPP with your Vercel project name
VERCEL_URL="https://your-app.vercel.app"

# Test health check
curl $VERCEL_URL/api/health

# Test admin login
curl -X POST $VERCEL_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ahababatef14@gmail.com","password":"admin12345"}'

# Access your app
open $VERCEL_URL
```

---

## Your Live URLs (After Deployment)

```
Frontend:  https://resume-portal.vercel.app
Backend:   https://resume-portal.vercel.app/api
Dashboard: https://resume-portal.vercel.app (login with admin credentials)
```

---

## Features Live

✅ **Admin Dashboard** - Login, manage jobs, flag fraud users  
✅ **Job Management** - Create, edit, close, feature jobs  
✅ **Fraud Detection** - Flag/unflag users and jobs with risk levels  
✅ **Resume Upload** - Upload PDF/DOCX, auto-extract skills  
✅ **Audit Logs** - Track all API actions with timestamps  
✅ **Real-time Updates** - Live job and user status  

---

## Troubleshooting

**Issue: Deployment failed**
→ Check Vercel dashboard logs for errors
→ Verify all environment variables are set

**Issue: API returns 500**
→ Check MongoDB connection string is correct
→ Verify JWT_SECRET matches backend

**Issue: Frontend shows blank**
→ Check browser console (F12) for errors
→ Clear cache and reload

**Issue: "Cannot find module" error**
→ Click "Redeploy" in Vercel dashboard

---

## What's Deployed

```
Root Project (/) → Frontend React App
  ├── All React components (FraudPage, ResumePage, JobManagement)
  ├── Vite build output (optimized JS/CSS)
  └── Static assets

API Routes (/api) → Node.js Express Backend
  ├── /api/auth - Login/Register
  ├── /api/jobs - Job management
  ├── /api/admin - Admin controls & fraud flagging
  ├── /api/resumes - Resume upload & parsing
  ├── /api/audit-logs - Action tracking
  └── [More routes...]

Database → MongoDB Atlas (existing connection)
```

---

## Next Steps

1. **Deploy using Option A or B above**
2. **Get your Vercel URL** from dashboard
3. **Share the URL** with anyone to access
4. **Monitor** via Vercel Analytics dashboard

---

## Questions?

- Vercel docs: https://vercel.com/docs
- MongoDB docs: https://docs.mongodb.com/
- This project: See VERCEL_DEPLOYMENT.md or QUICK_DEPLOY.md

---

**Ready to go live? Pick Option A or B above and deploy!** 🚀

