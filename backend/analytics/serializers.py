from rest_framework import serializers
from .models import WeeklyAnalysis, MonthlyAnalysis, Suggestion


class WeeklyAnalysisSerializer(serializers.ModelSerializer):
    """
    Serializer for weekly analysis
    """
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = WeeklyAnalysis
        fields = ('id', 'user', 'user_name', 'week_start', 'week_end',
                  'total_bills', 'total_amount', 'total_tax', 'average_bill_amount',
                  'category_breakdown', 'top_vendors', 'trend_data',
                  'created_at', 'updated_at')
        read_only_fields = ('id', 'user', 'created_at', 'updated_at')


class MonthlyAnalysisSerializer(serializers.ModelSerializer):
    """
    Serializer for monthly analysis
    """
    user_name = serializers.CharField(source='user.username', read_only=True)
    month_name = serializers.SerializerMethodField()
    
    class Meta:
        model = MonthlyAnalysis
        fields = ('id', 'user', 'user_name', 'year', 'month', 'month_name',
                  'total_bills', 'total_amount', 'total_tax', 'average_bill_amount',
                  'category_breakdown', 'top_vendors', 'trend_data', 'growth_percentage',
                  'created_at', 'updated_at')
        read_only_fields = ('id', 'user', 'created_at', 'updated_at')
    
    def get_month_name(self, obj):
        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        return months[obj.month - 1] if 1 <= obj.month <= 12 else ''


class SuggestionSerializer(serializers.ModelSerializer):
    """
    Serializer for AI suggestions
    """
    class Meta:
        model = Suggestion
        fields = ('id', 'user', 'suggestion_type', 'title', 'description',
                  'related_data', 'is_read', 'is_dismissed', 'created_at')
        read_only_fields = ('id', 'user', 'created_at')
