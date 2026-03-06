# Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Backend Dependencies
Open a PowerShell/Terminal in the `server` folder:
```powershell
pip install -r requirements.txt
```

### Step 2: Start Backend Server
From the `server` folder, run:
```powershell
python src/main.py
```
✓ Backend will start at `http://localhost:8000`

### Step 3: Install Frontend Dependencies
Open a new PowerShell/Terminal in the `client` folder:
```powershell
npm install
```

### Step 4: Start Frontend
From the `client` folder, run:
```powershell
npm start
```
✓ Frontend will open at `http://localhost:3000`

---

## 📝 What to Do Next

1. **View API Documentation**
   - Go to `http://localhost:8000/docs` (Swagger UI)
   - See all available API endpoints

2. **Explore the Application**
   - Home page with feature overview
   - Navigation sidebar with all features

3. **Test Features**

   **Authentication:**
   - Click "Sign Up" to create account
   - Click "Login" to login

   **Compare Insurance Plans:**
   - Click sidebar "Compare Plans"
   - Select 2 plans to compare
   - View side-by-side comparison

   **Get Recommendation:**
   - Click sidebar "Get Recommendation"
   - Enter age: 35, Budget: 120
   - Get personalized recommendation

   **Submit Claim:**
   - Click sidebar "Submit Claim"
   - Policy: `POL-2024-001234`
   - Reason: Medical Expense
   - Amount: 5000
   - Submit and get claim ID

---

## 🔍 Project Structure

```
meera/
├── client/           ← React Frontend
│   ├── src/pages/            (6 pages)
│   ├── src/components/        (6 components)
│   ├── src/features/          (service files)
│   └── package.json
│
└── server/           ← FastAPI Backend
    ├── src/models/           (data models)
    ├── src/modules/          (auth, insurance, etc.)
    └── requirements.txt
```

---

## 🐛 Troubleshooting

### Port already in use?
- Backend: Change port in `main.py` (search for `port=8000`)
- Frontend: Run `npm start` will ask for different port

### CORS errors?
- Make sure backend is running on `http://localhost:8000`
- CORS is already enabled in `main.py`

### Dependencies not installing?
- Backend: `pip install --upgrade pip` then retry
- Frontend: Delete `node_modules` folder and run `npm install` again

### JavaScript/React errors?
- Clear browser cache (Ctrl+Shift+Delete)
- Refresh page
- Check browser console for specific errors

---

## 📚 Key Files to Explore

**Backend:**
- `server/src/main.py` - Main FastAPI app
- `server/src/modules/auth/controller.py` - Login/Signup APIs
- `server/src/modules/insurance/controller.py` - Insurance plan APIs
- `server/src/modules/recommendation/service.py` - Recommendation logic

**Frontend:**
- `client/src/App.js` - Main app routing
- `client/src/pages/` - All page components
- `client/src/components/Navbar.js` - Navigation component
- `client/src/App.css` - All styling

---

## 🎯 Sample Data to Test

**Test Sign Up:**
- Full Name: John Doe
- Email: john@example.com
- Password: password123

**Test Claim:**
- Policy: POL-2024-001234
- Reason: Medical Expense
- Amount: 5000

**Test Recommendation:**
- Age: 35
- Budget: 120

---

## 📞 API Endpoints Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/signup | Create account |
| POST | /auth/login | Login |
| GET | /insurance/plans | Get all plans |
| POST | /insurance/recommend | Get recommendation |
| POST | /claims/submit | Submit claim |
| GET | / | API health check |
| GET | /health | Server status |

---

## ✨ Features at a Glance

✅ User Authentication (Signup/Login)
✅ Compare Insurance Plans
✅ Personalized Recommendations
✅ Submit Claims
✅ Responsive Design
✅ Clean & Simple Code
✅ Real Backend APIs
✅ No Tailwind (Plain CSS)
✅ Functional Components (React)
✅ JWT Token Authentication

---

## 💡 Tips

1. Keep both terminals open (one for backend, one for frontend)
2. Frontend hot-reloads on code changes
3. Backend requires restart after code changes
4. Use browser DevTools (F12) to see network calls
5. Check browser console for errors
6. Check terminal for backend logs

---

Enjoy the application! 🎉
