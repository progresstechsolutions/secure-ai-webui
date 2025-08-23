# Database Migration Guide

## 🎯 **Objective**
Replace localStorage usage with proper database endpoints on your Railway backend to fix the `QuotaExceededError` and provide real data persistence.

## 🗄️ **Required Database Endpoints**

### **1. User Management**
```
POST   /users                    - Create new user
GET    /users/:id               - Get user by ID
PATCH  /users/:id               - Update user
DELETE /users/:id               - Delete user
```

### **2. Onboarding Management**
```
POST   /users/:id/onboarding    - Create onboarding data
GET    /users/:id/onboarding    - Get onboarding data
PATCH  /users/:id/onboarding    - Update onboarding data
```

### **3. Community Management**
```
POST   /communities             - Create new community
GET    /communities             - Get all communities
GET    /communities/:id         - Get community by ID
PATCH  /communities/:id         - Update community
DELETE /communities/:id         - Delete community
```

### **4. Post Management**
```
POST   /posts                   - Create new post
GET    /posts                   - Get all posts (optional: ?communityId=123)
GET    /posts/:id               - Get post by ID
PATCH  /posts/:id               - Update post
DELETE /posts/:id               - Delete post
```

## 🚀 **Implementation Steps**

### **Step 1: Database Schema**
Create these tables in your Railway database:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255),
  image TEXT,
  health_conditions TEXT[],
  location JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Onboarding table
CREATE TABLE onboarding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  data JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Communities table
CREATE TABLE communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  members UUID[],
  posts UUID[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Posts table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  title VARCHAR(255),
  likes UUID[],
  comments UUID[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### **Step 2: FastAPI Endpoints**
Add these endpoints to your Railway backend:

```python
from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
from datetime import datetime

# User endpoints
@app.post("/users")
async def create_user(user_data: UserCreate, db: Session = Depends(get_db)):
    # Implementation here
    pass

@app.get("/users/{user_id}")
async def get_user(user_id: str, db: Session = Depends(get_db)):
    # Implementation here
    pass

@app.patch("/users/{user_id}")
async def update_user(user_id: str, updates: UserUpdate, db: Session = Depends(get_db)):
    # Implementation here
    pass

@app.delete("/users/{user_id}")
async def delete_user(user_id: str, db: Session = Depends(get_db)):
    # Implementation here
    pass

# Onboarding endpoints
@app.post("/users/{user_id}/onboarding")
async def create_onboarding(user_id: str, onboarding_data: OnboardingCreate, db: Session = Depends(get_db)):
    # Implementation here
    pass

@app.get("/users/{user_id}/onboarding")
async def get_onboarding(user_id: str, db: Session = Depends(get_db)):
    # Implementation here
    pass

@app.patch("/users/{user_id}/onboarding")
async def update_onboarding(user_id: str, updates: OnboardingUpdate, db: Session = Depends(get_db)):
    # Implementation here
    pass

# Community endpoints
@app.post("/communities")
async def create_community(community_data: CommunityCreate, db: Session = Depends(get_db)):
    # Implementation here
    pass

@app.get("/communities")
async def get_communities(db: Session = Depends(get_db)):
    # Implementation here
    pass

@app.get("/communities/{community_id}")
async def get_community(community_id: str, db: Session = Depends(get_db)):
    # Implementation here
    pass

@app.patch("/communities/{community_id}")
async def update_community(community_id: str, updates: CommunityUpdate, db: Session = Depends(get_db)):
    # Implementation here
    pass

@app.delete("/communities/{community_id}")
async def delete_community(community_id: str, db: Session = Depends(get_db)):
    # Implementation here
    pass

# Post endpoints
@app.post("/posts")
async def create_post(post_data: PostCreate, db: Session = Depends(get_db)):
    # Implementation here
    pass

@app.get("/posts")
async def get_posts(community_id: Optional[str] = None, db: Session = Depends(get_db)):
    # Implementation here
    pass

@app.get("/posts/{post_id}")
async def get_post(post_id: str, db: Session = Depends(get_db)):
    # Implementation here
    pass

@app.patch("/posts/{post_id}")
async def update_post(post_id: str, updates: PostUpdate, db: Session = Depends(get_db)):
    # Implementation here
    pass

@app.delete("/posts/{post_id}")
async def delete_post(post_id: str, db: Session = Depends(get_db)):
    # Implementation here
    pass
```

### **Step 3: Frontend Integration**
The frontend is already prepared with:
- ✅ `lib/database.ts` - Database service
- ✅ `hooks/useDatabase.ts` - React hook for database operations
- ✅ Updated API configuration

### **Step 4: Gradual Migration**
1. **Phase 1**: Implement user and onboarding endpoints
2. **Phase 2**: Implement community endpoints
3. **Phase 3**: Implement post endpoints
4. **Phase 4**: Remove localStorage usage

## 🔧 **Testing the Migration**

### **Test Database Connection**
```bash
# Test health endpoint
curl https://secure-ai-production.up.railway.app/health

# Test user creation
curl -X POST https://secure-ai-production.up.railway.app/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","name":"Test User"}'
```

### **Frontend Testing**
1. Go to `/dashboard`
2. Check browser console for database logs
3. Verify API calls are being made to Railway backend

## 🚨 **Important Notes**

1. **CORS**: Ensure your Railway backend allows requests from your Vercel frontend
2. **Authentication**: Implement proper authentication for protected endpoints
3. **Error Handling**: Handle database errors gracefully
4. **Data Validation**: Validate all input data on the backend
5. **Backup**: Backup any existing localStorage data before migration

## 📚 **Next Steps**

1. **Implement backend endpoints** on Railway
2. **Test database connectivity** from frontend
3. **Gradually replace localStorage** calls with database calls
4. **Remove localStorage** dependencies completely
5. **Test full application** functionality

## 🆘 **Troubleshooting**

- **CORS errors**: Check Railway backend CORS configuration
- **404 errors**: Verify endpoint URLs match frontend configuration
- **Database errors**: Check Railway database logs and connection
- **Frontend errors**: Check browser console for detailed error messages

## 📞 **Support**

If you encounter issues during migration:
1. Check Railway backend logs
2. Verify database schema and connections
3. Test endpoints individually with curl/Postman
4. Check frontend console for detailed error messages 