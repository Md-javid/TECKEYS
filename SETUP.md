# 🚀 BillAgent Pro - Quick Setup Guide

**For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)**

---

## ⚡ Quick Start (3 Steps)

### 1️⃣ Configure API Key

Edit `.env` file and add your Gemini API key:
```env
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

**Get your API key:** https://ai.google.dev/

---

### 2️⃣ Start Backend Server

Open **Terminal 1**:
```bash
cd backend

# Windows
.\venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

# Start server
python manage.py runserver
```

**✅ Backend ready at:** `http://localhost:8000`

---

### 3️⃣ Start Frontend Server

Open **Terminal 2**:
```bash
# From project root
npm run dev
```

**✅ Frontend ready at:** `http://localhost:3001`

---

## 🎯 First Time Setup

If this is your first time running the project:

### Backend Setup (One-time)
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
.\venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Setup database
python manage.py migrate

# Create admin user (optional)
python manage.py createsuperuser
```

### Frontend Setup (One-time)
```bash
# From project root
npm install
```

---

## 📋 Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Python** 3.10+ ([Download](https://www.python.org/))
- **Gemini API Key** ([Get it](https://ai.google.dev/))

---

## 🔧 How to Use

1. **Sign Up** - Create a new account
2. **Upload Bill** - Upload a bill image (JPG/PNG)
3. **AI Processing** - Gemini AI extracts data automatically
4. **View Analytics** - Check your spending trends
5. **Manage History** - Search, edit, or delete bills

---

## 🐛 Common Issues

### Backend won't start?
```bash
# Make sure you're in the backend directory
cd backend

# Activate virtual environment
.\venv\Scripts\activate

# Try running again
python manage.py runserver
```

### Frontend won't start?
```bash
# Reinstall dependencies
npm install

# Try running again
npm run dev
```

### API Key not working?
1. Check `.env` file is in project root
2. Verify API key is correct
3. Restart frontend server (`Ctrl+C` then `npm run dev`)

---

## 📁 Project Structure

```
billagent-pro GOATED/
├── backend/              # Django API
│   ├── manage.py
│   ├── requirements.txt
│   └── ...
├── components/           # React components
├── services/             # API services
├── App.tsx              # Main app
├── .env                 # API keys (IMPORTANT!)
├── package.json         # Dependencies
└── DEPLOYMENT.md        # Full deployment guide
```

---

## 🎉 You're All Set!

**Running the app:**
1. Terminal 1: `cd backend && .\venv\Scripts\activate && python manage.py runserver`
2. Terminal 2: `npm run dev`
3. Open: `http://localhost:3001`

**For detailed instructions, troubleshooting, and production deployment, see [DEPLOYMENT.md](./DEPLOYMENT.md)**

---

## 📞 Need Help?

- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions
- Verify both servers are running
- Check browser console for errors
- Ensure `.env` has valid Gemini API key
