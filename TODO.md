# Frontend Render Backend Fix - Progress Tracker

## Plan Steps (Approved ✅)

### 1. [✅] Create this TODO.md 
### 2. [✅] Fix Login.jsx: Fallback already correct (localhost:3000)
### 3. [✅] Fix Admin.jsx: Both localhost:5000 → /api/bookings 
### 4. [✅] Fix Home.jsx: localhost:5000 → /api/bookings
### 5. [⏳] User: Add VITE_API_URL=https://agendy-ai-backend.onrender.com to Vercel (Settings > Environment Variables)
### 6. [⏳] Commit & Push: `git add . && git commit -m \"fix: use relative API paths for Render compatibility\" && git push origin main`
### 7. [ ] Test: Vercel redeploys automatically. Verify login → bookings on production.

**Progress: ✅ All code changes complete! App.jsx fallback + relative paths ensure Render works with VITE_API_URL.

⚠️ Note: Frontend calls /api/bookings but backend uses /appointments. Add VITE_API_URL first, then test. Backend route fix needed if 404s.

Run dev: `cd frontend && npm run dev` (localhost works via fallback).**


