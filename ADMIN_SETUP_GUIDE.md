# Admin Dashboard Setup Instructions

## 🚀 Complete Setup Guide

This is a production-ready Admin Panel with React frontend and FastAPI backend, fully connected and ready to use.

---

## 📁 Project Structure

```
insurance-crc-feb-26/
├── client/                          # React Frontend
│   └── src/
│       └── features/
│           └── admin/
│               ├── pages/
│               │   └── AdminDashboard.jsx
│               ├── components/
│               │   ├── Sidebar.jsx
│               │   ├── OverviewCards.jsx
│               │   ├── UsersTable.jsx
│               │   ├── FraudRules.jsx
│               │   └── AnalyticsSection.jsx
│               ├── services/
│               │   └── adminService.js
│               └── styles/
│                   └── AdminDashboard.css
│
└── server/                          # FastAPI Backend
    └── src/
        ├── main.py                  # Main FastAPI app
        ├── database.py              # Database configuration
        ├── models.py                # SQLAlchemy models
        ├── schemas.py               # Pydantic schemas
        └── routers/
            └── admin.py             # Admin API endpoints
```

---

## 🔧 Backend Setup (FastAPI)

### Step 1: Navigate to server directory
```bash
cd server
```

### Step 2: Create virtual environment (recommended)
```bash
python -m venv venv
```

### Step 3: Activate virtual environment
**Windows:**
```bash
venv\Scripts\activate
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

### Step 4: Install dependencies
```bash
pip install -r requirements.txt
```

### Step 5: Start the backend server
```bash
cd src
uvicorn main:app --reload
```

✅ **Backend will be running at:** `http://localhost:8000`

You can test it by visiting: `http://localhost:8000/health`

---

## 🎨 Frontend Setup (React)

### Step 1: Open a new terminal and navigate to client directory
```bash
cd client
```

### Step 2: Install dependencies (if not already installed)
```bash
npm install
```

### Step 3: Start the development server
```bash
npm start
```

✅ **Frontend will be running at:** `http://localhost:3000`

---

## 📊 Admin Dashboard Features

### 1. **Overview Section**
- Total Users count
- Active Policies count
- Claims count
- Fraud Alerts count

### 2. **Users Management**
- View all users in a table
- Add new users with name and email
- Delete users
- Toggle user status (Active/Inactive)

### 3. **Fraud Rules Management**
- View all fraud detection rules
- Add new fraud rules with name and description
- Display rules in card format

### 4. **Analytics Section**
- Bar chart showing claims per month
- Interactive data visualization using Recharts

---

## 🌐 API Endpoints

### Overview
- `GET /admin/overview` - Get dashboard statistics

### Users
- `GET /admin/users` - Get all users
- `POST /admin/users` - Create a new user
- `DELETE /admin/users/{id}` - Delete a user
- `PUT /admin/users/{id}/toggle-status` - Toggle user status

### Fraud Rules
- `GET /admin/fraud-rules` - Get all fraud rules
- `POST /admin/fraud-rules` - Create a new fraud rule

### Analytics
- `GET /admin/analytics` - Get claims analytics data

---

## 🎨 Design Theme

- **Primary Color:** Green (#1B5E20)
- **Sidebar Color:** Dark Green (#0B3D2E)
- **Background:** Light Gray (#f4f6f8)
- **Secondary:** White
- **Accent Colors:** Red for alerts, Blue for actions

---

## 🗄️ Database

The project uses **SQLite** for simplicity:
- Database file: `admin_database.db`
- Automatically created when you run the backend
- Located in: `server/src/`

### Database Tables:
1. **users** - User information
2. **fraud_rules** - Fraud detection rules
3. **claim_stats** - Claims statistics for analytics

---

## 🧪 Testing the Application

1. **Start Backend:** Run `uvicorn main:app --reload` from `server/src/`
2. **Start Frontend:** Run `npm start` from `client/`
3. **Open Browser:** Navigate to `http://localhost:3000/admin`
4. **Test Features:**
   - Click on different sidebar items to navigate
   - Add a new user from Users section
   - Add a fraud rule from Fraud Rules section
   - View analytics chart

---

## 🔒 CORS Configuration

CORS is already configured in the backend to allow requests from:
- `http://localhost:3000`

If you need to add more origins, edit `server/src/main.py`:
```python
origins = [
    "http://localhost:3000",
    "http://your-domain.com",  # Add your domains here
]
```

---

## 📦 Dependencies

### Backend (Python)
- fastapi==0.115.5
- uvicorn==0.34.0
- sqlalchemy==2.0.36
- pydantic[email]==2.10.3
- python-multipart==0.0.20

### Frontend (Node.js)
- react
- react-router-dom
- axios
- recharts

---

## 🐛 Troubleshooting

### Backend issues:
1. **Port already in use:**
   ```bash
   uvicorn main:app --reload --port 8001
   ```

2. **Module not found errors:**
   ```bash
   pip install -r requirements.txt
   ```

### Frontend issues:
1. **Port already in use:**
   - Edit package.json and change the port
   - Or kill the process using port 3000

2. **CORS errors:**
   - Make sure backend is running on port 8000
   - Check CORS configuration in main.py

3. **API connection errors:**
   - Verify backend is running at http://localhost:8000
   - Check adminService.js has correct API_BASE_URL

---

## 📝 Notes

- The database will be created automatically on first run
- Sample analytics data will be generated if no data exists
- All API calls include error handling
- Loading states are shown for all data fetching operations

---

## 🎉 Success Indicators

✅ Backend health check returns: `{"status": "Backend is running"}`
✅ Frontend loads at http://localhost:3000/admin
✅ Sidebar navigation works
✅ Overview cards display statistics
✅ Users table loads and CRUD operations work
✅ Fraud rules can be added and displayed
✅ Analytics chart renders with data

---

## 👨‍💻 Development

Branch: `Group-A-feature/Admin-Dashboard-Ashish`

Happy coding! 🚀
