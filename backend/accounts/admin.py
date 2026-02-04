from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Custom User admin
    """
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Store Information', {'fields': ('store_name', 'store_type', 'phone', 'address', 'profile_image')}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Store Information', {'fields': ('store_name', 'store_type', 'phone', 'address')}),
    )
    list_display = ['username', 'email', 'store_name', 'store_type', 'is_staff']
    list_filter = ['store_type', 'is_staff', 'is_active']
    search_fields = ['username', 'email', 'store_name']
