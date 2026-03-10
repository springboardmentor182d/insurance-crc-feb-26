# Insurance Comparison, Recommendation & Claim Assistant

A full-stack web application for insurance management with plan comparison, recommendations, and claim assistance.

## Project Structure

```
project-root/
├── client/          # React Frontend
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── components/       # Reusable components
│   │   ├── features/         # Feature services
│   │   ├── App.js
│   │   ├── index.js
│   │   ├── App.css
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── README.md
│
└── server/          # FastAPI Backend
    ├── src/
    │   ├── models/          # Data models
    │   ├── modules/         # Feature modules
    │   │   ├── auth/        # Authentication
    │   │   ├── insurance/   # Insurance plans
    │   │   ├── recommendation/  # Recommendations
    │   │   └── claims/      # Claims management
    │   └── main.py          # FastAPI application
    ├── requirements.txt
    └── README.md
```

## Features

### 🏠 Home
- Welcome page with feature overview
- Quick navigation to main features

### ⚖️ Compare Insurance Plans
- View all available insurance plans
- Compare up to 2 plans side-by-side
- See detailed plan features and prices

### 💡 Get Recommendation
- Get personalized insurance recommendation
- Based on age and monthly budget
- Smart recommendation logic:
  - Age < 30 → Basic Plan
  - Age 30-50 → Standard Plan
  - Age > 50 → Premium Plan

### 📝 Submit Claim
- Submit insurance claims easily
- Select claim reason (Medical, Hospitalization, Accident)
- Get claim confirmation with claim ID

### 🔐 Authentication
- User signup with email and password
- User login to access features
- Session management with JWT tokens

## Available Insurance Plans

1. **Basic Plan** - $50/month
   - Coverage: $100,000
   - Deductible: $1,000
   - Best for: Young, healthy individuals

2. **Standard Plan** - $100/month
   - Coverage: $250,000
   - Deductible: $500
   - Best for: Middle-aged individuals
   - Extra: Prescription coverage, Preventive care

3. **Premium Plan** - $200/month
   - Coverage: $500,000
   - Deductible: $250
   - Best for: Comprehensive coverage
   - Extra: Dental, Vision, Mental health services

## Technology Stack

### Frontend
- **React 18** - UI library
- **React Router v6** - Client-side routing
- **CSS3** - Styling (no frameworks)
- **Fetch API** - HTTP requests

### Backend
- **FastAPI** - Modern Python web framework
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server
- **JWT** - Token-based authentication

## Installation & Setup

### Backend Setup

1. Navigate to server folder:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the backend:
   ```bash
   python src/main.py
   ```

   The backend will start at `http://localhost:8000`

4. Access API documentation:
   - Swagger UI: `http://localhost:8000/docs`
   - ReDoc: `http://localhost:8000/redoc`

### Frontend Setup

1. Navigate to client folder:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

   The frontend will open at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /auth/signup` - Create a new user account
- `POST /auth/login` - Login with email and password

### Insurance Plans
- `GET /insurance/plans` - Get all insurance plans
- `POST /insurance/recommend` - Get recommendation based on age & budget

### Claims
- `POST /claims/submit` - Submit a new insurance claim

## Usage

1. **Start Backend**: Open terminal and run `python src/main.py` from the server folder
2. **Start Frontend**: Open another terminal and run `npm start` from the client folder
3. **Access Application**: Open http://localhost:3000 in your browser
4. **Sign Up**: Create a new account or use the app as a guest
5. **Explore Features**: Use the sidebar menu to navigate

## How to Use Each Feature

### Compare Insurance Plans
1. Click "Compare Plans" in the sidebar
2. Check boxes to select up to 2 plans
3. View comparison table automatically

### Get Recommendation
1. Click "Get Recommendation" in the sidebar
2. Enter your age and monthly budget
3. View the recommended plan

### Submit Claim
1. Click "Submit Claim" in the sidebar
2. Enter policy number
3. Select claim reason
4. Enter claim amount
5. Submit and receive claim ID

## Sample Test Data

### Test User
- Email: `test@example.com`
- Password: `password123`

### Test Policy Number
- `POL-2024-001234`

## Notes

- In-memory database is used (data resets on server restart)
- In production, implement a real database (PostgreSQL, MongoDB)
- Passwords are stored in plain text for demo purposes
- Use environment variables for sensitive data
- Implement proper password hashing with bcrypt in production

## Future Enhancements

- Database integration (PostgreSQL/MongoDB)
- Email notifications for claims
- User profile management
- Policy renewal reminders
- Mobile app version
- Advanced analytics and reporting
- Document upload for claims
- Payment gateway integration

## License

This project is open source and available for educational purposes.

## Support

For issues or questions, please create an issue in the repository.
