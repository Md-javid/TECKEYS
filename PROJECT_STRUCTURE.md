# 📁 BillAgent Pro - Project Structure

**Last Updated:** February 4, 2026

---

## 📂 Directory Overview

```
billagent-pro GOATED/
│
├── 📁 backend/                     # Django Backend Application
│   ├── 📁 accounts/               # User authentication & profiles
│   ├── 📁 analytics/              # Analytics & insights API
│   ├── 📁 bills/                  # Bill management API
│   ├── 📁 stores/                 # Store management API
│   ├── 📁 billagent_backend/      # Django project settings
│   ├── 📁 venv/                   # Python virtual environment
│   ├── db.sqlite3                 # SQLite database
│   ├── manage.py                  # Django management script
│   └── requirements.txt           # Python dependencies
│
├── 📁 components/                  # React Components
│   ├── Dashboard.tsx              # Main dashboard
│   ├── BillUpload.tsx             # Bill upload & processing
│   ├── BillHistory.tsx            # Bill history & management
│   ├── AnalyticsDashboard.tsx     # Analytics & charts
│   ├── Settings.tsx               # User settings
│   ├── Login.tsx                  # Login page
│   ├── Register.tsx               # Registration page
│   └── LandingPage.tsx            # Landing page
│
├── 📁 services/                    # API & Service Layer
│   ├── api.ts                     # Backend API client
│   └── geminiService.ts           # Gemini AI integration
│
├── 📁 node_modules/                # Node.js dependencies (auto-generated)
│
├── 📁 .agent/                      # Agent workflows
│   └── workflows/
│       └── django-migration.md
│
├── 📁 .github/                     # GitHub configuration
│
├── App.tsx                         # Main React application
├── index.tsx                       # React entry point
├── types.ts                        # TypeScript type definitions
├── index.css                       # Global CSS styles
├── index.html                      # HTML template
│
├── .env                            # Environment variables (IMPORTANT!)
├── .env.example                    # Example environment file
├── .gitignore                      # Git ignore rules
│
├── package.json                    # Node.js dependencies
├── package-lock.json               # Locked dependency versions
├── tsconfig.json                   # TypeScript configuration
├── vite.config.ts                  # Vite build configuration
│
├── setup.bat                       # Automated setup script
├── start-backend.bat               # Start Django server
├── start-frontend.bat              # Start React dev server
│
├── README.md                       # Project overview
├── SETUP.md                        # Quick setup guide
├── DEPLOYMENT.md                   # Complete deployment guide
└── PROJECT_STRUCTURE.md            # This file
```

---

## 🔍 File Descriptions

### Root Files

| File | Purpose | Important? |
|------|---------|------------|
| `App.tsx` | Main React component with routing | ⭐⭐⭐ |
| `index.tsx` | React entry point | ⭐⭐⭐ |
| `types.ts` | TypeScript type definitions | ⭐⭐⭐ |
| `index.css` | Global styles | ⭐⭐ |
| `index.html` | HTML template | ⭐⭐ |
| `.env` | **Environment variables (API keys)** | ⭐⭐⭐ |
| `.env.example` | Example environment file | ⭐⭐ |
| `package.json` | Node.js dependencies | ⭐⭐⭐ |
| `tsconfig.json` | TypeScript config | ⭐⭐ |
| `vite.config.ts` | Vite build config | ⭐⭐ |
| `.gitignore` | Git ignore rules | ⭐⭐ |

### Scripts

| File | Purpose | Usage |
|------|---------|-------|
| `setup.bat` | Automated first-time setup | Run once: `.\setup.bat` |
| `start-backend.bat` | Start Django server | `.\start-backend.bat` |
| `start-frontend.bat` | Start React dev server | `.\start-frontend.bat` |

### Documentation

| File | Purpose | When to Read |
|------|---------|--------------|
| `README.md` | Project overview & features | First time |
| `SETUP.md` | Quick setup instructions | Getting started |
| `DEPLOYMENT.md` | Complete deployment guide | Before presentation |
| `PROJECT_STRUCTURE.md` | This file | Understanding structure |

---

## 📦 Backend Structure

### Django Apps

```
backend/
├── accounts/           # User Management
│   ├── models.py      # User, Profile models
│   ├── views.py       # Auth endpoints
│   ├── serializers.py # Data serialization
│   └── urls.py        # URL routing
│
├── bills/             # Bill Management
│   ├── models.py      # Bill, BillItem models
│   ├── views.py       # CRUD endpoints
│   ├── serializers.py # Data serialization
│   └── urls.py        # URL routing
│
├── analytics/         # Analytics & Insights
│   ├── views.py       # Analytics endpoints
│   └── urls.py        # URL routing
│
├── stores/            # Store Management
│   ├── models.py      # Store model
│   ├── views.py       # Store endpoints
│   ├── serializers.py # Data serialization
│   └── urls.py        # URL routing
│
└── billagent_backend/ # Django Settings
    ├── settings.py    # Main configuration
    ├── urls.py        # Root URL routing
    └── wsgi.py        # WSGI application
```

### Backend API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/accounts/register/` | POST | User registration |
| `/api/accounts/login/` | POST | User login |
| `/api/accounts/profile/` | GET/PUT | User profile |
| `/api/bills/` | GET/POST | List/Create bills |
| `/api/bills/{id}/` | GET/PUT/DELETE | Bill details |
| `/api/analytics/` | GET | Analytics data |
| `/api/stores/` | GET/POST | Store management |

---

## 🎨 Frontend Structure

### Components

```
components/
├── LandingPage.tsx        # Public landing page
├── Login.tsx              # User login
├── Register.tsx           # User registration
├── Dashboard.tsx          # Main dashboard (after login)
├── BillUpload.tsx         # Upload & process bills
├── BillHistory.tsx        # View & manage bills
├── AnalyticsDashboard.tsx # Analytics & charts
└── Settings.tsx           # User settings
```

### Services

```
services/
├── api.ts                 # Backend API client
│   ├── Auth functions
│   ├── Bill CRUD
│   ├── Analytics
│   └── Token management
│
└── geminiService.ts       # Gemini AI integration
    ├── Bill processing
    ├── Multi-agent validation
    └── Business insights
```

### State Management

- **Local State**: React `useState` for component state
- **User Context**: Stored in `App.tsx`
- **API Calls**: Axios with interceptors
- **Token Storage**: localStorage

---

## 🔐 Important Files (DO NOT DELETE)

### Critical Files
- ✅ `.env` - Contains API keys
- ✅ `backend/db.sqlite3` - Database
- ✅ `backend/venv/` - Python virtual environment
- ✅ `package.json` - Node dependencies
- ✅ `backend/requirements.txt` - Python dependencies

### Safe to Delete
- ❌ `node_modules/` - Can be regenerated with `npm install`
- ❌ `backend/venv/` - Can be recreated
- ❌ `dist/` - Build output (if exists)
- ❌ `__pycache__/` - Python cache

---

## 📊 File Sizes Reference

| Directory | Approximate Size |
|-----------|------------------|
| `node_modules/` | ~200-300 MB |
| `backend/venv/` | ~50-100 MB |
| `backend/db.sqlite3` | ~200 KB (grows with data) |
| Source code | ~5-10 MB |
| Documentation | ~50 KB |

---

## 🔄 Build Outputs

### Development
- Frontend runs on: `http://localhost:3001`
- Backend runs on: `http://localhost:8000`
- No build files generated

### Production Build
```bash
npm run build
```
Creates `dist/` folder with:
- `index.html`
- `assets/` (JS, CSS bundles)

---

## 🗂️ Configuration Files

### Frontend Configuration

| File | Purpose |
|------|---------|
| `vite.config.ts` | Vite build settings |
| `tsconfig.json` | TypeScript compiler options |
| `package.json` | Dependencies & scripts |
| `.env` | Environment variables |

### Backend Configuration

| File | Purpose |
|------|---------|
| `backend/billagent_backend/settings.py` | Django settings |
| `backend/requirements.txt` | Python dependencies |
| `backend/manage.py` | Django CLI |

---

## 📝 Environment Variables

### `.env` File Structure
```env
# Gemini AI API Key (REQUIRED)
VITE_GEMINI_API_KEY=your_api_key_here

# Backend API URL
VITE_API_URL=http://localhost:8000/api
```

**⚠️ IMPORTANT:** Never commit `.env` to version control!

---

## 🚀 Quick Commands Reference

### Setup (First Time)
```bash
# Automated setup
.\setup.bat

# Or manual:
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
cd ..
npm install
```

### Development
```bash
# Terminal 1: Backend
.\start-backend.bat

# Terminal 2: Frontend
.\start-frontend.bat
```

### Production Build
```bash
# Frontend
npm run build

# Backend
cd backend
python manage.py collectstatic
```

---

## 🧹 Cleanup Commands

### Remove Build Artifacts
```powershell
# Remove node_modules
Remove-Item -Recurse -Force node_modules

# Remove Python cache
Remove-Item -Recurse -Force backend\__pycache__
Remove-Item -Recurse -Force backend\*\__pycache__

# Remove build output
Remove-Item -Recurse -Force dist
```

### Fresh Install
```bash
# Frontend
Remove-Item -Recurse -Force node_modules
npm install

# Backend
Remove-Item -Recurse -Force backend\venv
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

---

## 📦 Dependencies Overview

### Frontend (package.json)
- **react** - UI library
- **react-dom** - React DOM rendering
- **typescript** - Type safety
- **vite** - Build tool
- **axios** - HTTP client
- **lucide-react** - Icons
- **recharts** - Charts
- **@google/genai** - Gemini AI SDK

### Backend (requirements.txt)
- **Django** - Web framework
- **djangorestframework** - REST API
- **django-cors-headers** - CORS support
- **djangorestframework-simplejwt** - JWT auth
- **pillow** - Image processing
- **python-decouple** - Environment variables
- **psycopg2-binary** - PostgreSQL support

---

## 🎯 Project Organization Best Practices

### ✅ DO
- Keep `.env` file secure
- Update documentation when adding features
- Use meaningful commit messages
- Test before deploying
- Keep dependencies updated

### ❌ DON'T
- Commit `.env` to git
- Delete `node_modules` unless reinstalling
- Modify `package-lock.json` manually
- Change database schema without migrations
- Store sensitive data in code

---

## 📞 Need Help?

- **Setup Issues**: See [SETUP.md](./SETUP.md)
- **Deployment**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Features**: See [README.md](./README.md)
- **Structure**: This file

---

**Project organized and ready for presentation! 🚀**
