# Test Login Credentials

## Available Test Users

### User 1: vishnu
- **Username**: `vishnu`
- **Password**: `vishnu123`
- **Email**: vishnu@billagent.com
- **Name**: Vishnu Dharshan

### User 2: admin
- **Username**: `admin`
- **Password**: (Check with admin)
- **Email**: admin@billagent.com

### User 3: amal
- **Username**: `amal`
- **Password**: (Unknown - needs to be reset)

### User 4: Jarvis
- **Username**: `Jarvis`
- **Password**: (Unknown - needs to be reset)

### User 5: Thiran
- **Username**: `Thiran`
- **Password**: (Unknown - needs to be reset)

---

## How to Login

1. Navigate to http://localhost:3001/
2. Click on "Login" or "Get Started"
3. Enter the username and password
4. Click "Sign In"

---

## Troubleshooting

If login fails, check:
1. Backend is running on http://localhost:8000
2. Frontend is running on http://localhost:3001
3. Check browser console for errors (F12)
4. Verify credentials match exactly (case-sensitive)

## Creating New Users

To create a new test user, run:
```bash
cd backend
python3 create_user.py
```

Or register through the UI at http://localhost:3001/
