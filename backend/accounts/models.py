from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Custom User model with store information
    """
    STORE_TYPES = [
        ('retail', 'Retail Store'),
        ('restaurant', 'Restaurant'),
        ('grocery', 'Grocery Store'),
        ('pharmacy', 'Pharmacy'),
        ('electronics', 'Electronics Store'),
        ('clothing', 'Clothing Store'),
        ('other', 'Other'),
    ]
    
    # Store information
    store_name = models.CharField(max_length=255, blank=True)
    store_type = models.CharField(max_length=50, choices=STORE_TYPES, default='other')
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    
    # Profile
    profile_image = models.ImageField(upload_to='profiles/', null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.username} - {self.store_name}"
