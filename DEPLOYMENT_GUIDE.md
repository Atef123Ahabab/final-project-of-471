# 🚀 DEPLOYMENT GUIDE - Resume Portal with Fraud Detection

Your project is **100% ready for deployment**. Follow these steps to get a public link in about 5 minutes.

## 📋 Quick Setup (3 Steps)

### **Step 1: Push to GitHub (2 minutes)**

```bash
# Create a new repo on GitHub: https://github.com/new
# Name it: resume-portal (or any name you prefer)

# After creating the GitHub repo, run these commands:
cd /Users/atefahabab/Downloads/471-2-features-merge-ready

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/resume-portal.git
git branch -M main
git push -u origin main
```

### **Step 2: Deploy to Vercel (3 minutes)**

**Option A: Automatic via Web UI (Easiest)**
1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Paste your GitHub repo URL: `https://github.com/YOUR_USERNAME/resume-portal.git`
4. Click "Import"
5. Set Environment Variables (copy-paste these exactly):
   ```
   MONGODB_URI=mongodb://ibrahimisfar_db_user:hedasudir@ac-5yf19ok-shard-00-00.4xgqkqt.mongodb.net:27017,ac-5yf19ok-shard-00-01.4xgqkqt.mongodb.net:27017,ac-5yf19ok-shard-00-02.4xgqkqt.mongodb.net:27017/resume-job-portal?tls=true&replicaSet=atlas-z6svrs-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=change-this-jwt-secret
   ADMIN_EMAIL=ahababatef14@gmail.com
   ADMIN_PASSWORD=admin12345
   ADZUNA_APP_ID=30b3f865
   ADZUNA_APP_KEY=46ecdf42bed868930056cfd1685ba5a7
   ```
6. Click "Deploy"
7. Done! Wait 2-3 minutes for deployment to complete. You'll get a .vercel.app link.

**Option B: Via Vercel CLI**
```bash
npm install -g vercel
vercel --prod
# Follow the prompts, set env vars when asked
```

---

## 🎯 What Gets Deployed

✅ **Frontend**: React + Vite app deployed to Vercel CDN  
✅ **Backend**: Node.js API routes running on Vercel  
✅ **Database**: MongoDB Atlas (already connected)  

### Frontend URL: `https://your-project.vercel.app`
### Backend API: `https://your-project.vercel.app/api`

---

## 🔑 Test Your Deployment

After deployment completes, test these endpoints:

```bash
# Health check
curl https://your-project.vercel.app/api/health

# Admin login
curl -X POST https://your-project.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ahababatef14@gmail.com","password":"admin12345"}'

# Get audit logs
curl https://your-project.vercel.app/api/audit-logs
```

---

## 🔐 Security Notes

⚠️ **Before sharing publicly:**
1. Change `JWT_SECRET` in Vercel environment variables to something secure
2. Change `ADMIN_PASSWORD` to a strong password
3. Regenerate `ADZUNA_APP_KEY` if this repo is public

---

## 📱 Features Included

- ✅ Admin Authentication (Login with email/password)
- ✅ Job Posting & Management (Create, Edit, Close, Feature jobs)
- ✅ Fraud & Spam Detection (Flag/Unflag users and jobs)
- ✅ Resume Upload & Parsing (PDF/DOCX file extraction)
- ✅ Audit Logs (All API actions tracked with timestamps)
- ✅ Responsive UI (Works on desktop and mobile)
- ✅ Real-time Status Updates (Live job and user status)

---

## 🆘 Troubleshooting

**Q: Deployment fails with "Cannot find module"?**  
A: Click "Redeploy" in Vercel dashboard, or check if all npm packages are installed

**Q: API returns 500 error?**  
A: Check that all environment variables are set correctly in Vercel dashboard

**Q: Frontend loads but shows blank?**  
A: Clear browser cache (Ctrl+Shift+Del) and reload

**Q: Database connection times out?**  
A: Check if MongoDB Atlas IP whitelist allows Vercel's IPs (should be automatic)

---

## 📞 Your Public Links (After Deployment)

```
Frontend: https://your-project.vercel.app
Backend API: https://your-project.vercel.app/api
Admin Dashboard: https://your-project.vercel.app (Login with admin credentials)
```

---

## ✨ Next Steps

1. Follow the Quick Setup steps above
2. Share your `.vercel.app` link
3. Users can access the portal and login with admin credentials
4. Use the admin dashboard to manage jobs, flag users, and view audit logs

**That's it! Your production app is live.** 🎉

For issues, check Vercel's deployment logs: https://vercel.com/dashboard

