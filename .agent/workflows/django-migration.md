---
description: Migrate to Django backend with authentication and analytics
---

# Django Backend Migration with Enhanced Features

## Phase 1: Django Backend Setup

### 1. Create Django Project Structure
```bash
# Create backend directory
mkdir backend
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows

# Install Django and dependencies
pip install django djangorestframework django-cors-headers djangorestframework-simplejwt pillow python-decouple psycopg2-binary
```

### 2. Initialize Django Project
```bash
django-admin startproject billagent_backend .
python manage.py startapp accounts
python manage.py startapp bills
python manage.py startapp analytics
python manage.py startapp stores
```

### 3. Database Setup
- Configure PostgreSQL or SQLite in settings.py
- Create models for: User, Store, Bill, Analysis
- Run migrations

## Phase 2: Backend Implementation

### 1. User Authentication System
- Custom User model with store details
- JWT authentication
- Registration endpoint (collect: name, email, password, store_name, store_type, address, phone)
- Login endpoint
- Protected routes

### 2. Database Models
- **User**: Extended with store information
- **Store**: Store details, type, settings
- **Bill**: Bill data, OCR results, user FK
- **Analysis**: Weekly/monthly aggregated data
- **Suggestion**: AI-generated suggestions

### 3. API Endpoints
- `/api/auth/register/` - User registration
- `/api/auth/login/` - User login
- `/api/auth/user/` - Get current user
- `/api/bills/` - CRUD for bills
- `/api/analytics/weekly/` - Weekly analysis
- `/api/analytics/monthly/` - Monthly analysis
- `/api/suggestions/` - Get AI suggestions
- `/api/stores/` - Store management

## Phase 3: Frontend Enhancements

### 1. Authentication Pages
- Login page with form validation
- Signup page (collect all required details)
- Protected route wrapper
- JWT token management

### 2. Dashboard System
- Main Dashboard (overview)
- Bills Dashboard (all bills with filters)
- Analytics Dashboard (charts & graphs)
- Weekly Analysis View
- Monthly Analysis View
- Suggestions Dashboard

### 3. Charts & Visualizations
- Revenue trends (line chart)
- Category breakdown (pie chart)
- Monthly comparison (bar chart)
- Top items (horizontal bar)
- Weekly patterns (area chart)

### 4. Store-Specific UI
- Dynamic theming based on store type
- Customizable layouts
- Store branding integration

## Phase 4: Integration

### 1. Connect Frontend to Django API
- Axios setup for API calls
- JWT interceptors
- Error handling
- Loading states

### 2. Keep OCR Service
- Frontend handles image processing with Gemini
- Send extracted data to Django backend
- Store in database

### 3. Analysis Engine
- Backend cron job for weekly/monthly analysis
- AI-powered suggestions using stored data
- Trend detection

## Phase 5: Testing & Deployment

### 1. Test all endpoints
### 2. Test authentication flow
### 3. Verify data persistence
### 4. Check authorization on all protected routes

## Tech Stack
- **Backend**: Django 5.x, Django REST Framework, JWT
- **Database**: PostgreSQL (production) / SQLite (development)
- **Frontend**: React + TypeScript (existing)
- **OCR**: Gemini AI (existing, frontend)
- **Charts**: Recharts (existing)
