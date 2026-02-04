import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'billagent_backend.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@billagent.com', 'admin123')
    print('✅ Superuser created successfully!')
    print('📧 Email: admin@billagent.com')
    print('👤 Username: admin')
    print('🔑 Password: admin123')
    print('\n🌐 Access admin panel at: http://127.0.0.1:8000/admin/')
else:
    print('⚠️  Superuser already exists!')
    print('👤 Username: admin')
    print('🔑 Password: admin123')
    print('\n🌐 Access admin panel at: http://127.0.0.1:8000/admin/')
