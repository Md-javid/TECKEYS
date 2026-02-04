from django.contrib import admin
from .models import WeeklyAnalysis, MonthlyAnalysis, Suggestion


@admin.register(WeeklyAnalysis)
class WeeklyAnalysisAdmin(admin.ModelAdmin):
    list_display = ['user', 'week_start', 'week_end', 'total_bills', 'total_amount', 'created_at']
    list_filter = ['week_start', 'created_at']
    search_fields = ['user__username']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(MonthlyAnalysis)
class MonthlyAnalysisAdmin(admin.ModelAdmin):
    list_display = ['user', 'year', 'month', 'total_bills', 'total_amount', 'growth_percentage', 'created_at']
    list_filter = ['year', 'month', 'created_at']
    search_fields = ['user__username']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Suggestion)
class SuggestionAdmin(admin.ModelAdmin):
    list_display = ['user', 'suggestion_type', 'title', 'is_read', 'is_dismissed', 'created_at']
    list_filter = ['suggestion_type', 'is_read', 'is_dismissed', 'created_at']
    search_fields = ['user__username', 'title', 'description']
