# ⚡ FASTEST DEPLOYMENT (5 Minutes)

## **Option 1: Deploy to Vercel WITHOUT GitHub (Fastest)**

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Deploy to Production
```bash
cd /Users/atefahabab/Downloads/471-2-features-merge-ready
vercel --prod
```

### Step 3: When prompted, answer:
```
? Set up and deploy from this directory? (Y/n)  → Y
? Which scope should we deploy to?              → (select your account)
? Link to existing project?                     → N
? What's your project's name?                   → resume-portal
? In which directory is your code located?      → ./
? Auto-detected Project Settings for Vite       → (press Enter)
```

### Step 4: Add Environment Variables
After deployment starts, go to:
https://vercel.com/dashboard → Your project → Settings → Environment Variables

Add these:
```
MONGODB_URI=mongodb://ibrahimisfar_db_user:hedasudir@ac-5yf19ok-shard-00-00.4xgqkqt.mongodb.net:27017,ac-5yf19ok-shard-00-01.4xgqkqt.mongodb.net:27017,ac-5yf19ok-shard-00-02.4xgqkqt.mongodb.net:27017/resume-job-portal?tls=true&replicaSet=atlas-z6svrs-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0

JWT_SECRET=your-secret-key-here

ADMIN_EMAIL=ahababatef14@gmail.com

ADMIN_PASSWORD=admin12345

ADZUNA_APP_ID=30b3f865

ADZUNA_APP_KEY=46ecdf42bed868930056cfd1685ba5a7
```

Then click "Redeploy" to apply environment variables.

---

## Your Live URL After Deployment:
**`https://resume-portal.vercel.app`** (or similar)

---

## **Option 2: Via GitHub (If preferred)**

1. Create GitHub repo: https://github.com/new
2. Connect it to Vercel: https://vercel.com/new
3. Add environment variables in Vercel dashboard
4. Done!

---

## 🧪 Test After Deployment
Visit your URL and test:
- Frontend loads ✓
- Admin login works ✓
- Can create jobs ✓
- Can flag fraud ✓

---

**Ready to deploy? Run the commands above, or let me know if you need help!**
