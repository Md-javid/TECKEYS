# 🧾 BillAgent Pro

**An AI-Powered Bill Management System with Multi-Agent Intelligence**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![Django](https://img.shields.io/badge/Django-5.0-green.svg)](https://www.djangoproject.com/)

---

## 🌟 Overview

BillAgent Pro is an intelligent bill management system that leverages **Google Gemini AI** to automatically extract, organize, and analyze financial data from bill images. Built with a modern tech stack and multi-agent architecture, it streamlines expense tracking and provides actionable insights.

### ✨ Key Features

- **🤖 AI-Powered OCR** - Gemini AI extracts vendor, date, total, tax, and line items from bill images
- **📊 Smart Analytics** - Visualize spending trends, category breakdowns, and top vendors
- **🔍 Intelligent Search** - Find bills instantly with advanced filtering
- **📈 Real-time Dashboard** - Monitor expenses with interactive charts
- **🔐 Secure Authentication** - JWT-based auth with user isolation
- **🎯 Multi-Agent System** - Validation, learning, and correction agents
- **📱 Responsive Design** - Works seamlessly on desktop and mobile

---

## 🎥 Demo

![BillAgent Pro Dashboard](https://via.placeholder.com/1200x600/1a1a2e/eee?text=BillAgent+Pro+Dashboard)

### Core Workflows

1. **Upload Bill** → AI extracts data → Review & confirm
2. **View Analytics** → Track trends → Get insights
3. **Manage History** → Search bills → Edit/Delete
4. **Settings** → Update profile → Configure preferences

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Vite** - Lightning-fast build tool
- **Recharts** - Data visualization
- **Axios** - HTTP client

### Backend
- **Django 5.0** - Robust web framework
- **Django REST Framework** - RESTful API
- **SQLite** - Development database
- **JWT Authentication** - Secure token-based auth
- **CORS Headers** - Cross-origin support

### AI/ML
- **Google Gemini 1.5 Flash** - Vision and language model
- **Multi-Agent Architecture** - Validation, learning, and correction agents

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- Gemini API Key ([Get it here](https://ai.google.dev/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/billagent-pro.git
   cd billagent-pro
   ```

2. **Configure environment**
   ```bash
   # Copy example env file
   copy .env.example .env
   
   # Edit .env and add your Gemini API key
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

3. **Start Backend**
   ```bash
   cd backend
   python -m venv venv
   .\venv\Scripts\activate  # Windows
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver
   ```

4. **Start Frontend** (in new terminal)
   ```bash
   npm install
   npm run dev
   ```

5. **Access the app**
   ```
   Frontend: http://localhost:3001
   Backend:  http://localhost:8000
   Admin:    http://localhost:8000/admin
   ```

**For detailed setup instructions, see [SETUP.md](./SETUP.md)**  
**For deployment guide, see [DEPLOYMENT.md](./DEPLOYMENT.md)**

---

## 📖 Documentation

- **[SETUP.md](./SETUP.md)** - Quick setup guide
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment instructions
- **[QUICKSTART.md](./QUICKSTART.md)** - Getting started tutorial
- **[API Documentation](./backend/README.md)** - API endpoints reference

---

## 🎯 Features in Detail

### 1. AI-Powered Bill Processing
- Upload bill images (JPG, PNG, PDF)
- Automatic data extraction using Gemini Vision API
- Extracts: vendor, date, total, tax, line items
- Confidence scoring for accuracy
- Multi-agent validation

### 2. Analytics Dashboard
- **Revenue Trends** - Monthly and weekly charts
- **Category Breakdown** - Pie charts for spending categories
- **Top Vendors** - Most frequent suppliers
- **Smart Insights** - AI-generated recommendations
- **Export Data** - CSV/PDF reports

### 3. Bill History Management
- **Search & Filter** - By date, vendor, amount
- **Inline Editing** - Update bill details
- **Bulk Actions** - Delete multiple bills
- **Pagination** - Handle large datasets
- **Sorting** - By any column

### 4. User Management
- **Registration** - Email/password signup
- **Authentication** - JWT tokens (access + refresh)
- **Profile Management** - Update user details
- **Store Settings** - Configure business info
- **Multi-tenant** - Isolated data per user

---

## 🏗️ Architecture

### Multi-Agent System

```
┌─────────────────────────────────────────────┐
│           User Uploads Bill Image           │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│      Gemini Vision API (OCR Agent)          │
│  Extracts: vendor, date, total, tax, items  │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│       Validation Agent                      │
│  Checks data consistency and accuracy       │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│       Learning Agent                        │
│  Learns from user corrections               │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│       Store in Database                     │
└─────────────────────────────────────────────┘
```

### API Architecture

```
Frontend (React)  ←→  Backend (Django REST)  ←→  Database (SQLite)
                           ↓
                      Gemini API
```

---

## 📁 Project Structure

```
billagent-pro/
├── backend/                    # Django Backend
│   ├── accounts/              # User authentication
│   ├── bills/                 # Bill management
│   ├── analytics/             # Analytics API
│   ├── stores/                # Store management
│   ├── billagent_backend/     # Django settings
│   └── requirements.txt       # Python dependencies
│
├── components/                 # React Components
│   ├── Dashboard.tsx
│   ├── BillUpload.tsx
│   ├── BillHistory.tsx
│   ├── AnalyticsDashboard.tsx
│   ├── Settings.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   └── LandingPage.tsx
│
├── services/                   # API Services
│   ├── api.ts                 # Backend API client
│   └── geminiService.ts       # Gemini AI integration
│
├── App.tsx                     # Main application
├── types.ts                    # TypeScript definitions
├── .env                        # Environment variables
└── package.json                # Node dependencies
```

---

## 🔒 Security

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - Django's built-in PBKDF2
- **CORS Protection** - Configured for localhost
- **Data Isolation** - User-specific data access
- **Environment Variables** - Sensitive data in `.env`
- **Input Validation** - Server-side validation
- **SQL Injection Protection** - Django ORM

---

## 🧪 Testing

```bash
# Backend tests
cd backend
python manage.py test

# Frontend tests (if configured)
npm test
```

---

## 📊 Performance

- **Fast OCR** - Gemini 1.5 Flash processes images in ~2-3 seconds
- **Optimized Queries** - Django ORM with select_related
- **Lazy Loading** - Components load on demand
- **Caching** - API responses cached
- **Pagination** - Efficient data loading

---

## 🌐 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

### Backend (Railway/Render)
```bash
pip install gunicorn
gunicorn billagent_backend.wsgi:application
```

**For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)**

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Your Name** - *Initial work*

---

## 🙏 Acknowledgments

- Google Gemini AI for powerful vision capabilities
- Django and React communities
- All contributors and testers

---

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for troubleshooting
- Review [SETUP.md](./SETUP.md) for setup help

---

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Bulk bill upload
- [ ] Advanced analytics (ML predictions)
- [ ] Multi-currency support
- [ ] Receipt templates
- [ ] Email integration
- [ ] Cloud storage (AWS S3)
- [ ] Real-time collaboration

---

**Made with ❤️ for efficient bill management**
