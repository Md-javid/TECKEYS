from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Bill(models.Model):
    """
    Bill model to store bill information
    """
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('verified', 'Verified'),
        ('corrected', 'Corrected'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bills')
    
    # Bill details
    bill_number = models.CharField(max_length=100, blank=True)
    vendor_name = models.CharField(max_length=255, blank=True)
    date = models.DateField(null=True, blank=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Image
    image = models.ImageField(upload_to='bills/')
    
    # OCR data
    ocr_data = models.JSONField(default=dict, blank=True)
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Metadata
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['date']),
        ]
    
    def __str__(self):
        return f"Bill {self.bill_number} - {self.vendor_name} - ${self.total_amount}"


class BillItem(models.Model):
    """
    Individual items in a bill
    """
    bill = models.ForeignKey(Bill, on_delete=models.CASCADE, related_name='items')
    
    name = models.CharField(max_length=255)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    
    category = models.CharField(max_length=100, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['id']
    
    def __str__(self):
        return f"{self.name} - {self.quantity} x ${self.unit_price}"


class BillCorrection(models.Model):
    """
    Track user corrections for learning
    """
    bill = models.ForeignKey(Bill, on_delete=models.CASCADE, related_name='corrections')
    
    field_name = models.CharField(max_length=100)
    original_value = models.TextField()
    corrected_value = models.TextField()
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Correction for {self.bill.bill_number} - {self.field_name}"
