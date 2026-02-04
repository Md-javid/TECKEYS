import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'billagent_backend.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Create a regular user
username = 'vishnu'
email = 'vishnu@billagent.com'
password = 'vishnu123'
first_name = 'Vishnu'
last_name = 'Dharshan'

if not User.objects.filter(username=username).exists():
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name
    )
    print('✅ User created successfully!')
    print(f'📧 Email: {email}')
    print(f'👤 Username: {username}')
    print(f'🔑 Password: {password}')
    print(f'👨 Name: {first_name} {last_name}')
    print('\n🌐 Login at: http://localhost:3000/login')
else:
    print('⚠️  User already exists!')
    print(f'👤 Username: {username}')
    print(f'🔑 Password: {password}')
    print('\n🌐 Login at: http://localhost:3000/login')
