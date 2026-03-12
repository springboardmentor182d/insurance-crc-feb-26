# Clean Architecture Implementation Guide

## PART 1: Architecture Overview

### Clean Architecture Layers

```
┌─────────────────────────────────────────────────────┐
│          PRESENTATION LAYER (React)                 │
│  - React Components                                 │
│  - User Interface                                   │
│  - State Management (local)                         │
└──────────────────┬──────────────────────────────────┘
                   │ REST API Calls via apiService.js
┌──────────────────▼──────────────────────────────────┐
│          APPLICATION LAYER (FastAPI)                │
│  - Route Handlers                                   │
│  - Request/Response Validation (Pydantic)           │
│  - Error Handling                                   │
│  - Business Logic Orchestration                     │
└──────────────────┬──────────────────────────────────┘
                   │ ORM (SQLAlchemy)
┌──────────────────▼──────────────────────────────────┐
│        BUSINESS LOGIC LAYER (Services)              │
│  - Calculations                                     │
│  - Filtering & Aggregation                          │
│  - Data Transformations                             │
└──────────────────┬──────────────────────────────────┘
                   │ Database Queries
┌──────────────────▼──────────────────────────────────┐
│         DATA ACCESS LAYER (Models)                  │
│  - SQLAlchemy Models                                │
│  - Database Schema                                  │
│  - Relationships                                    │
└──────────────────┬──────────────────────────────────┘
                   │ SQL
┌──────────────────▼──────────────────────────────────┐
│       DATA LAYER (PostgreSQL Database)              │
│  - Persistent Storage                               │
│  - ACID Transactions                                │
│  - Relationships & Constraints                      │
└─────────────────────────────────────────────────────┘
```

---

## PART 2: Frontend Implementation Examples

### Example 1: Fetching Policies (Refactored Component)

**File:** `client/src/features/admin/components/Policies.jsx`

```jsx
import React, { useState, useEffect } from "react";
import { catalogService } from "../../../services/apiService";

const Policies = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load policies from API on component mount
  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    try {
      setLoading(true);
      // API call via service layer (not hardcoded)
      const data = await catalogService.getPolicies();
      setPolicies(data);
    } catch (error) {
      console.error("Failed to load policies", error);
    } finally {
      setLoading(false);
    }
  };

  // Create policy via API
  const handleSavePolicy = async (policyData) => {
    try {
      if (editingId) {
        // Update existing
        await catalogService.updatePolicy(editingId, policyData);
      } else {
        // Create new
        await catalogService.createPolicy(policyData);
      }
      
      // Refresh list
      await loadPolicies();
    } catch (error) {
      console.error("Failed to save policy", error);
    }
  };

  return (
    <div>
      {loading ? <p>Loading...</p> : renderPoliciesTable(policies)}
    </div>
  );
};
```

**Key Changes:**
- ✅ No hardcoded policies array
- ✅ Fetches from `/catalog/policies` endpoint
- ✅ Uses API service layer
- ✅ Proper error handling and loading states

---

### Example 2: Handling Environment Variables

**File:** `client/.env`
```env
REACT_APP_BASE_URL=http://localhost:8000
REACT_APP_API_TIMEOUT=30000
```

**File:** `client/src/services/apiService.js`
```javascript
const API_BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";

const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(await response.json());
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error: ${endpoint}`, error);
    throw error;
  }
};
```

**Benefits:**
- ✅ No hardcoded URLs in components
- ✅ Easy to change for different environments
- ✅ Centralized API configuration

---

### Example 3: Using Recommendations Component

**File:** `client/src/components/RecommendationCard.js`

```jsx
// Usage 1: Get all health recommendations
<RecommendationCard category="Health" />

// Usage 2: Get top recommendations only
<RecommendationCard category="Health" topOnly={true} />

// Usage 3: Get all categories
<RecommendationCard />
```

**Behind the scenes:**
```javascript
const loadRecommendations = async () => {
  // All data comes from backend API
  const data = await catalogService.getRecommendations({
    category: category,
  });
  
  setRecommendations(data.recommendations);
};
```

---

## PART 3: Backend Implementation Examples

### Example 1: Policy Endpoint (No Business Logic in Frontend)

**File:** `server/src/routers/catalog.py`

```python
@router.get("/policies", response_model=List[schemas.PolicyResponse])
def get_policies(
    policy_type: str = Query(None),
    is_active: bool = Query(True),
    db: Session = Depends(get_db)
):
    """
    Fetch policies with filtering.
    
    Business Logic:
    - Filter by type
    - Filter by active status
    - Return validated response
    """
    query = db.query(models.Policy).filter(
        models.Policy.is_active == is_active
    )
    
    if policy_type:
        query = query.filter(models.Policy.policy_type == policy_type)
    
    policies = query.all()  # Database query
    return policies  # Pydantic validates response schema
```

**Key Points:**
- ✅ All filtering logic on backend
- ✅ Validation via Pydantic schemas
- ✅ Direct database access via ORM
- ✅ Frontend just receives clean data

---

### Example 2: Creating Policy (Backend Validation)

**File:** `server/src/routers/catalog.py`

```python
@router.post("/policies", response_model=schemas.PolicyResponse)
def create_policy(
    policy: schemas.PolicyCreate,  # Validates request data
    db: Session = Depends(get_db)
):
    """
    Create new policy with validation.
    
    Validation:
    - Pydantic validates all fields
    - Type checking (String, Float, Boolean)
    - Required fields enforcement
    """
    # Data is already validated by Pydantic
    db_policy = models.Policy(**policy.dict())
    db.add(db_policy)
    db.commit()
    db.refresh(db_policy)
    return db_policy  # Response validated by schema
```

**Validation Example:**

```python
# Schema definition (server/src/schemas.py)
class PolicyCreate(BaseModel):
    name: str                    # Required
    provider: str                # Required
    policy_type: str            # Required
    coverage: str               # Required
    premium: str                # Required
    claim_ratio: Optional[str]   # Optional
    description: Optional[str]   # Optional

# Invalid request would return 422 (validation error)
# {
#   "detail": [
#     {
#       "loc": ["body", "name"],
#       "msg": "field required",
#       "type": "value_error.missing"
#     }
#   ]
# }
```

---

### Example 3: Recommendations with Calculations

**File:** `server/src/routers/catalog.py`

```python
@router.get("/recommendations", response_model=schemas.RecommendationListResponse)
def get_recommendations(
    category: str = Query(None),
    top_only: bool = Query(False),
    is_active: bool = Query(True),
    db: Session = Depends(get_db)
):
    """
    Fetch recommendations with calculation logic.
    
    Business Logic:
    - Filter by category
    - Filter by match score
    - Sort by relevance
    - Return count of total
    """
    query = db.query(models.Recommendation).filter(
        models.Recommendation.is_active == is_active
    )
    
    # Business logic: Apply filters
    if category:
        query = query.filter(models.Recommendation.category == category)
    
    if top_only:
        # Business logic: Only top recommendations
        query = query.filter(
            models.Recommendation.is_top_recommendation == True
        )
    
    # Business logic: Sort by match score
    recommendations = query.order_by(
        models.Recommendation.match_score.desc()
    ).all()
    
    return {
        "recommendations": recommendations,
        "total_count": len(recommendations)
    }
```

**Frontend receives:**
```json
{
  "recommendations": [
    {
      "id": 1,
      "category": "Health",
      "title": "Comprehensive Health Shield",
      "match_score": 95.0,
      ...
    }
  ],
  "total_count": 1
}
```

---

### Example 4: Environment Variables in Backend

**File:** `server/.env`
```env
DATABASE_URL=postgresql://insurance_user:password@localhost:5432/insurance_crc_db
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
ENVIRONMENT=development
```

**File:** `server/src/database.py`
```python
import os
from dotenv import load_dotenv

load_dotenv()  # Load .env file

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres@localhost:5432/insurance_crc_db"
)
```

**File:** `server/src/main.py`
```python
allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000"
).split(",")
```

---

## PART 4: Database Schema

### PostgreSQL Tables (Auto-created by SQLAlchemy)

```sql
-- Policies table
CREATE TABLE policies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    policy_type VARCHAR(100) NOT NULL,
    coverage VARCHAR(100) NOT NULL,
    premium VARCHAR(100) NOT NULL,
    claim_ratio VARCHAR(10),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recommendations table
CREATE TABLE recommendations (
    id SERIAL PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    match_score FLOAT DEFAULT 0.0,
    coverage VARCHAR(100) NOT NULL,
    premium VARCHAR(100) NOT NULL,
    claim_ratio VARCHAR(10),
    risk_level VARCHAR(50),
    why TEXT,
    family_health TEXT,
    is_top_recommendation BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## PART 5: Mentor Checklist

### ✅ 1. CLEAN PROJECT STRUCTURE
- [x] Root contains only: client/, server/, README.md, .gitignore, .git/
- [x] No random files outside client and server folders
- [x] Documentation in markdown files at root level

### ✅ 2. REMOVE FRONTEND DUMMY DATA
- [x] No hardcoded data in React components
- [x] recommendationsData.js removed
- [x] All data fetched from backend API
- [x] Frontend never stores static lists

### ✅ 3. SHIFT LOGIC FROM FRONTEND TO BACKEND
- [x] No business logic in React components
- [x] All calculations in FastAPI endpoints
- [x] Frontend only: Request + Display
- [x] Backend handles: Calculations + Aggregations + Analytics

### ✅ 4. FETCH DATA FROM DATABASE
- [x] No static arrays in components
- [x] All data from `/catalog/policies` API
- [x] All recommendations from `/catalog/recommendations` API
- [x] CRUD operations via API endpoints

### ✅ 5. FETCH POLICIES FROM DATABASE
- [x] Backend models for Policy created
- [x] `/catalog/policies` endpoint implemented
- [x] `/catalog/policy-types` endpoint for dynamic types
- [x] Frontend fetches via API (Policies.jsx refactored)

### ✅ 6. MOVE BASE URL TO ENV FILE
- [x] Created `client/.env` with REACT_APP_BASE_URL
- [x] Created `server/.env` with DATABASE_URL
- [x] All API calls use environment variable
- [x] No hardcoded URLs in components

### ✅ 7. FIX MERGE CONFLICT IN REQUIREMENTS
- [x] `server/requirements.txt` cleaned
- [x] All merge conflict markers removed
- [x] Unified dependencies list
- [x] PostgreSQL support added

### ✅ 8. MIGRATE DATABASE TO POSTGRESQL
- [x] Updated `server/src/database.py` for PostgreSQL
- [x] psycopg2-binary added to requirements
- [x] Database URL from environment variable
- [x] Connection pooling configured
- [x] Created POSTGRESQL_SETUP.md guide

### ✅ ARCHITECTURE RULES FOLLOWED
- [x] Frontend: Only UI + API calls + user interaction
- [x] Backend: Business logic + calculations + database queries
- [x] Database: PostgreSQL with proper schema
- [x] No hardcoded data in frontend
- [x] All configuration via environment variables

---

## PART 6: Quick Start Commands

### Setup Backend
```bash
cd server

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: .\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Note: Create PostgreSQL database first (see POSTGRESQL_SETUP.md)
# Then configure server/.env

# Run server
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

### Setup Frontend
```bash
cd client

# Install dependencies
npm install

# Run development server
npm start
# App opens at http://localhost:3000
```

### Verify Setup
```bash
# Check backend health
curl http://localhost:8000/health
# Response: {"status":"Backend is running","service":"Insurance CRC API"}

# Check policies endpoint
curl http://localhost:8000/catalog/policies
# Response: [...policies data from database...]

# Check recommendations
curl http://localhost:8000/catalog/recommendations
# Response: {"recommendations":[...],"total_count":X}
```

---

## PART 7: File Changes Summary

### New Files Created
```
server/.env                          # Backend environment variables
server/src/routers/catalog.py        # Policy & Recommendation endpoints
client/.env                          # Frontend environment variables
client/src/services/apiService.js    # Centralized API service
POSTGRESQL_SETUP.md                  # Database configuration guide
REFACTORING_SUMMARY.md               # Detailed changes documentation
CLEAN_ARCHITECTURE.md                # This file
```

### Modified Files
```
server/requirements.txt              # Fixed merge conflicts, added deps
server/src/database.py              # PostgreSQL support
server/src/main.py                  # Fixed merge conflicts, unified
server/src/models.py                # Added Policy & Recommendation models
server/src/schemas.py               # Added corresponding schemas
client/src/components/RecommendationCard.js     # Fetch from API
client/src/features/admin/components/Policies.jsx # Fetch from API
client/src/features/admin/components/OverviewCards.jsx  # Updated
```

### Removed Files
```
client/src/data/recommendationsData.js
client/src/data/configValues.json
client/src/data/defaultTools.json
```

---

## PART 8: Testing the Refactored Code

### Test 1: Fetch Policies
```bash
# Browser navigate to: http://localhost:3000/admin
# Go to Policies tab
# Should see 5 policies loaded from database

# Or via cURL:
curl 'http://localhost:8000/catalog/policies'
```

### Test 2: Create Policy
```bash
curl -X POST 'http://localhost:8000/catalog/policies' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Test Policy",
    "provider": "Test Provider",
    "policy_type": "Health",
    "coverage": "₹5.0L",
    "premium": "₹15,000/yr",
    "claim_ratio": "95%"
  }'
```

### Test 3: Get Recommendations
```bash
# Get all recommendations
curl 'http://localhost:8000/catalog/recommendations'

# Get top recommendations only
curl 'http://localhost:8000/catalog/recommendations?top_only=true'

# Get by category
curl 'http://localhost:8000/catalog/recommendations?category=Health'
```

### Test 4: Environment Variables
```bash
# Frontend should use env variable
# Check: Network tab shows requests to http://localhost:8000
# (not hardcoded URL)

# Backend should use PostgreSQL
# No admin_database.db file created
# All data in PostgreSQL
```

---

## PART 9: Production Deployment Checklist

### Before Production
- [ ] Change `DEBUG=False` in `server/.env`
- [ ] Set strong `SECRET_KEY` in `server/.env`
- [ ] Use production PostgreSQL instance
- [ ] Set `ENVIRONMENT=production` in `server/.env`
- [ ] Update `ALLOWED_ORIGINS` for production domain
- [ ] Set `REACT_APP_BASE_URL` to production API URL
- [ ] Enable HTTPS for all connections
- [ ] Set up database backups
- [ ] Configure firewall rules
- [ ] Set up monitoring and logging

### Environment Example
```env
# Production .env
DATABASE_URL=postgresql://insurance_user:strong_password@prod-db:5432/insurance_crc_db
DEBUG=False
SECRET_KEY=generated-strong-secret-key-here
ALGORITHM=HS256
ALLOWED_ORIGINS=https://insurance.example.com,https://app.example.com
ENVIRONMENT=production
```

---

## Summary

This refactoring successfully transforms the Insurance CRC project from a monolithic frontend-heavy application to a clean, scalable architecture following these principles:

1. **Separation of Concerns** - Clear boundaries between frontend, backend, and database
2. **DRY (Don't Repeat Yourself)** - No duplicate data or logic
3. **Configuration Management** - Environment-based setup
4. **Validation** - Pydantic schemas validate all data
5. **Scalability** - Easy to add features without affecting other layers
6. **Maintainability** - Well-organized code is easy to understand and modify
7. **Production-Ready** - Security, error handling, and logging considered

All mentor feedback has been addressed and implemented.
