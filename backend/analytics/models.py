from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class WeeklyAnalysis(models.Model):
    """
    Weekly aggregated analytics
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='weekly_analyses')
    
    week_start = models.DateField()
    week_end = models.DateField()
    
    # Metrics
    total_bills = models.IntegerField(default=0)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_tax = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    average_bill_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Category breakdown
    category_breakdown = models.JSONField(default=dict, blank=True)
    
    # Top vendors
    top_vendors = models.JSONField(default=list, blank=True)
    
    # Trends
    trend_data = models.JSONField(default=dict, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-week_start']
        unique_together = ['user', 'week_start']
    
    def __str__(self):
        return f"Weekly Analysis: {self.week_start} to {self.week_end} - {self.user.username}"


class MonthlyAnalysis(models.Model):
    """
    Monthly aggregated analytics
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='monthly_analyses')
    
    year = models.IntegerField()
    month = models.IntegerField()
    
    # Metrics
    total_bills = models.IntegerField(default=0)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_tax = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    average_bill_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Category breakdown
    category_breakdown = models.JSONField(default=dict, blank=True)
    
    # Top vendors
    top_vendors = models.JSONField(default=list, blank=True)
    
    # Trends
    trend_data = models.JSONField(default=dict, blank=True)
    
    # Comparison with previous month
    growth_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-year', '-month']
        unique_together = ['user', 'year', 'month']
    
    def __str__(self):
        return f"Monthly Analysis: {self.year}-{self.month:02d} - {self.user.username}"


class Suggestion(models.Model):
    """
    AI-generated suggestions for users
    """
    SUGGESTION_TYPES = [
        ('cost_saving', 'Cost Saving'),
        ('trend', 'Trend Alert'),
        ('anomaly', 'Anomaly Detection'),
        ('recommendation', 'Recommendation'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='suggestions')
    
    suggestion_type = models.CharField(max_length=50, choices=SUGGESTION_TYPES)
    title = models.CharField(max_length=255)
    description = models.TextField()
    
    # Related data
    related_data = models.JSONField(default=dict, blank=True)
    
    # Status
    is_read = models.BooleanField(default=False)
    is_dismissed = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.suggestion_type}: {self.title}"
