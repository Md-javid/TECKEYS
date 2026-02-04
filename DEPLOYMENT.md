# 🚀 BillAgent Pro - Complete Deployment Guide

**Last Updated:** February 4, 2026  
**Status:** ✅ Production Ready

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Detailed Setup](#detailed-setup)
4. [Running the Application](#running-the-application)
5. [Environment Configuration](#environment-configuration)
6. [Troubleshooting](#troubleshooting)
7. [Production Deployment](#production-deployment)

---

## ✅ Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.10 or higher) - [Download](https://www.python.org/)
- **npm** (comes with Node.js)
- **pip** (comes with Python)

### Required API Keys
- **Google Gemini API Key** - [Get it here](https://ai.google.dev/)

### Verify Installation
```bash
# Check Node.js version
node --version  # Should be v18.0.0 or higher

# Check Python version
python --version  # Should be 3.10 or higher

# Check npm version
npm --version

# Check pip version
pip --version
```

---

## ⚡ Quick Start

### Option 1: Automated Setup (Recommended)

**Windows:**
```bash
# Run the setup script
.\setup.bat
```

**Mac/Linux:**
```bash
# Make script executable
chmod +x setup.sh

# Run the setup script
./setup.sh
```

### Option 2: Manual Setup

Follow the [Detailed Setup](#detailed-setup) section below.

---

## 🔧 Detailed Setup

### Step 1: Clone/Download the Project

If you haven't already, download or clone the project:
```bash
cd "c:\Users\conne\Downloads\billagent-pro GOATED"
```

### Step 2: Configure Environment Variables

1. **Copy the example environment file:**
   ```bash
   copy .env.example .env
   ```

2. **Edit the `.env` file and add your Gemini API Key:**
   ```env
   VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
   VITE_API_URL=http://localhost:8000/api
   ```

   **🔑 How to get your Gemini API Key:**
   - Visit [Google AI Studio](https://ai.google.dev/)
   - Click "Get API Key"
   - Create a new project or select existing
   - Copy your API key and paste it in the `.env` file

### Step 3: Backend Setup (Django)

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment:**
   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate

   # Mac/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run database migrations:**
   ```bash
   python manage.py migrate
   ```

5. **Create a superuser (optional but recommended):**
   ```bash
   python manage.py createsuperuser
   ```
   Follow the prompts to create an admin account.

6. **Verify backend setup:**
   ```bash
   python manage.py check
   ```
   You should see: "System check identified no issues (0 silenced)."

### Step 4: Frontend Setup (React + Vite)

1. **Navigate back to project root:**
   ```bash
   cd ..
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Verify frontend setup:**
   ```bash
   npm run build
   ```
   This will create a production build to verify everything is working.

---

## 🏃 Running the Application

### Development Mode (Recommended for Presentation)

You need to run **both** the backend and frontend servers simultaneously.

#### Terminal 1: Start Backend Server

```bash
# Navigate to backend directory
cd backend

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Start Django server
python manage.py runserver
```

**✅ Backend is ready when you see:**
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

**Backend URL:** `http://localhost:8000`  
**API URL:** `http://localhost:8000/api`  
**Admin Panel:** `http://localhost:8000/admin`

---

#### Terminal 2: Start Frontend Server

```bash
# Navigate to project root (if not already there)
cd "c:\Users\conne\Downloads\billagent-pro GOATED"

# Start Vite development server
npm run dev
```

**✅ Frontend is ready when you see:**
```
  VITE v6.2.0  ready in XXX ms

  ➜  Local:   http://localhost:3001/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**Frontend URL:** `http://localhost:3001` (or 3000 if available)

---

### Access the Application

1. **Open your browser**
2. **Navigate to:** `http://localhost:3001`
3. **You should see the BillAgent Pro landing page**

---

## 🔐 Environment Configuration

### Frontend Environment Variables (`.env`)

```env
# Gemini API Key (REQUIRED)
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Backend API URL
VITE_API_URL=http://localhost:8000/api
```

### Backend Environment Variables (Optional)

For production, you can create `backend/.env`:

```env
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
```

---

## 🎯 First-Time Usage Guide

### 1. Create an Account
- Click "Get Started" or "Sign Up"
- Fill in your details:
  - Email
  - Password
  - Full Name
- Click "Create Account"

### 2. Login
- Use your email and password
- Click "Sign In"

### 3. Set Up Your Store (Optional)
- Go to "Settings" tab
- Add your store information:
  - Store name
  - Address
  - Contact details

### 4. Upload Your First Bill
- Go to "Upload Bill" tab
- Click "Choose File" or drag and drop
- Select a bill image (JPG, PNG, PDF)
- Click "Process Bill"
- Wait for AI to extract data
- Review and confirm the extracted information

### 5. View Analytics
- Go to "Analytics" tab
- See your spending trends
- View category breakdowns
- Check top vendors

### 6. Manage Bill History
- Go to "History" tab
- Search and filter bills
- Edit or delete bills
- Export data

---

## 🐛 Troubleshooting

### Issue: "Module not found" errors

**Solution:**
```bash
# Frontend
npm install

# Backend
cd backend
pip install -r requirements.txt
```

---

### Issue: Backend won't start - "Port 8000 already in use"

**Solution:**
```bash
# Windows - Find and kill process on port 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:8000 | xargs kill -9
```

---

### Issue: Frontend won't start - "Port 3000/3001 already in use"

**Solution:**
Vite will automatically try the next available port (3001, 3002, etc.)

Or manually kill the process:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

---

### Issue: "Gemini API Key not working"

**Solution:**
1. Verify your API key is correct in `.env`
2. Ensure `.env` file is in the project root (not in backend/)
3. Restart the frontend server after updating `.env`
4. Check API key validity at https://ai.google.dev/

---

### Issue: Database errors

**Solution:**
```bash
cd backend

# Delete existing database
del db.sqlite3  # Windows
rm db.sqlite3   # Mac/Linux

# Re-run migrations
python manage.py migrate

# Create new superuser
python manage.py createsuperuser
```

---

### Issue: CORS errors in browser console

**Solution:**
1. Ensure backend is running on `http://localhost:8000`
2. Ensure frontend `.env` has correct `VITE_API_URL`
3. Restart both servers

---

### Issue: "venv not recognized" (Windows)

**Solution:**
```bash
# Use full path
cd backend
python -m venv venv
.\venv\Scripts\activate.bat
```

---

## 🌐 Production Deployment

### Frontend (Vite Build)

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

The built files will be in the `dist/` folder.

### Backend (Django)

```bash
cd backend

# Collect static files
python manage.py collectstatic

# Run with production server (e.g., Gunicorn)
pip install gunicorn
gunicorn billagent_backend.wsgi:application --bind 0.0.0.0:8000
```

### Deployment Platforms

**Frontend:**
- Vercel (Recommended)
- Netlify
- GitHub Pages

**Backend:**
- Railway
- Render
- Heroku
- DigitalOcean

**Database:**
- PostgreSQL (Recommended for production)
- MySQL
- SQLite (Development only)

---

## 📊 Project Structure

```
billagent-pro GOATED/
│
├── 📁 backend/                 # Django Backend
│   ├── accounts/              # User authentication
│   ├── bills/                 # Bill management
│   ├── analytics/             # Analytics API
│   ├── stores/                # Store management
│   ├── billagent_backend/     # Django settings
│   ├── manage.py              # Django management
│   ├── requirements.txt       # Python dependencies
│   └── db.sqlite3             # SQLite database
│
├── 📁 components/              # React Components
│   ├── Dashboard.tsx
│   ├── BillUpload.tsx
│   ├── BillHistory.tsx
│   ├── AnalyticsDashboard.tsx
│   ├── Settings.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   └── LandingPage.tsx
│
├── 📁 services/                # API Services
│   ├── api.ts                 # API client
│   └── geminiService.ts       # Gemini AI integration
│
├── App.tsx                     # Main React app
├── index.tsx                   # React entry point
├── types.ts                    # TypeScript types
├── index.css                   # Global styles
├── index.html                  # HTML template
│
├── .env                        # Environment variables (IMPORTANT!)
├── .env.example                # Example environment file
├── package.json                # Node.js dependencies
├── tsconfig.json               # TypeScript config
├── vite.config.ts              # Vite config
│
├── DEPLOYMENT.md               # This file
├── SETUP.md                    # Setup guide
└── README.md                   # Project overview
```

---

## 🔒 Security Checklist

- [ ] Gemini API key is in `.env` (not committed to git)
- [ ] `.env` is in `.gitignore`
- [ ] Django `SECRET_KEY` is secure (for production)
- [ ] `DEBUG=False` in production
- [ ] CORS settings are properly configured
- [ ] Database credentials are secure
- [ ] HTTPS enabled in production

---

## 📞 Support & Resources

### Documentation
- [Django Documentation](https://docs.djangoproject.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Gemini API Documentation](https://ai.google.dev/docs)

### Common Commands Reference

**Backend:**
```bash
python manage.py runserver          # Start dev server
python manage.py migrate            # Run migrations
python manage.py createsuperuser    # Create admin user
python manage.py shell              # Django shell
```

**Frontend:**
```bash
npm run dev                         # Start dev server
npm run build                       # Build for production
npm run preview                     # Preview production build
```

---

## ✅ Pre-Presentation Checklist

- [ ] Backend server is running (`http://localhost:8000`)
- [ ] Frontend server is running (`http://localhost:3001`)
- [ ] Gemini API key is configured in `.env`
- [ ] Test account created and working
- [ ] Sample bills uploaded and processed
- [ ] Analytics showing data
- [ ] All features tested:
  - [ ] Login/Registration
  - [ ] Bill upload and processing
  - [ ] Bill history and search
  - [ ] Analytics dashboard
  - [ ] Settings/Profile update
- [ ] No console errors in browser
- [ ] Both servers are stable

---

## 🎉 You're Ready!

Your BillAgent Pro application is now **deployment-ready** and configured for your presentation!

**Quick Start Commands:**

**Terminal 1 (Backend):**
```bash
cd backend
.\venv\Scripts\activate
python manage.py runserver
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

**Access:** `http://localhost:3001`

---

**Good luck with your presentation! 🚀**
