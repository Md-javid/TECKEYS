from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Avg, Count
from django.utils import timezone
from datetime import timedelta, datetime
from .models import WeeklyAnalysis, MonthlyAnalysis, Suggestion
from .serializers import WeeklyAnalysisSerializer, MonthlyAnalysisSerializer, SuggestionSerializer
from bills.models import Bill


class AnalyticsViewSet(viewsets.ViewSet):
    """
    ViewSet for analytics endpoints
    """
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def weekly(self, request):
        """
        Get or generate weekly analysis
        """
        # Get week parameter or use current week
        week_offset = int(request.query_params.get('week_offset', 0))
        
        today = timezone.now().date()
        week_start = today - timedelta(days=today.weekday() + (7 * week_offset))
        week_end = week_start + timedelta(days=6)
        
        # Try to get existing analysis
        analysis, created = WeeklyAnalysis.objects.get_or_create(
            user=request.user,
            week_start=week_start,
            defaults={'week_end': week_end}
        )
        
        if created or request.query_params.get('refresh') == 'true':
            # Generate analysis
            bills = Bill.objects.filter(
                user=request.user,
                date__gte=week_start,
                date__lte=week_end
            )
            
            analysis.total_bills = bills.count()
            analysis.total_amount = bills.aggregate(Sum('total_amount'))['total_amount__sum'] or 0
            analysis.total_tax = bills.aggregate(Sum('tax_amount'))['tax_amount__sum'] or 0
            analysis.average_bill_amount = bills.aggregate(Avg('total_amount'))['total_amount__avg'] or 0
            
            # Category breakdown
            category_breakdown = {}
            for bill in bills:
                for item in bill.items.all():
                    category = item.category or 'Uncategorized'
                    category_breakdown[category] = category_breakdown.get(category, 0) + float(item.total_price)
            analysis.category_breakdown = category_breakdown
            
            # Top vendors
            vendor_totals = bills.values('vendor_name').annotate(
                total=Sum('total_amount'),
                count=Count('id')
            ).order_by('-total')[:5]
            analysis.top_vendors = list(vendor_totals)
            
            analysis.save()
        
        serializer = WeeklyAnalysisSerializer(analysis)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def monthly(self, request):
        """
        Get or generate monthly analysis
        """
        # Get month parameter or use current month
        month_offset = int(request.query_params.get('month_offset', 0))
        
        today = timezone.now().date()
        target_date = today - timedelta(days=30 * month_offset)
        year = target_date.year
        month = target_date.month
        
        # Try to get existing analysis
        analysis, created = MonthlyAnalysis.objects.get_or_create(
            user=request.user,
            year=year,
            month=month
        )
        
        if created or request.query_params.get('refresh') == 'true':
            # Generate analysis
            bills = Bill.objects.filter(
                user=request.user,
                date__year=year,
                date__month=month
            )
            
            analysis.total_bills = bills.count()
            analysis.total_amount = bills.aggregate(Sum('total_amount'))['total_amount__sum'] or 0
            analysis.total_tax = bills.aggregate(Sum('tax_amount'))['tax_amount__sum'] or 0
            analysis.average_bill_amount = bills.aggregate(Avg('total_amount'))['total_amount__avg'] or 0
            
            # Category breakdown
            category_breakdown = {}
            for bill in bills:
                for item in bill.items.all():
                    category = item.category or 'Uncategorized'
                    category_breakdown[category] = category_breakdown.get(category, 0) + float(item.total_price)
            analysis.category_breakdown = category_breakdown
            
            # Top vendors
            vendor_totals = bills.values('vendor_name').annotate(
                total=Sum('total_amount'),
                count=Count('id')
            ).order_by('-total')[:5]
            analysis.top_vendors = list(vendor_totals)
            
            # Calculate growth
            prev_month = month - 1 if month > 1 else 12
            prev_year = year if month > 1 else year - 1
            prev_analysis = MonthlyAnalysis.objects.filter(
                user=request.user,
                year=prev_year,
                month=prev_month
            ).first()
            
            if prev_analysis and prev_analysis.total_amount > 0:
                growth = ((analysis.total_amount - prev_analysis.total_amount) / prev_analysis.total_amount) * 100
                analysis.growth_percentage = growth
            
            analysis.save()
        
        serializer = MonthlyAnalysisSerializer(analysis)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """
        Get dashboard overview data
        """
        user = request.user
        today = timezone.now().date()
        
        # Current month stats
        current_month_bills = Bill.objects.filter(
            user=user,
            date__year=today.year,
            date__month=today.month
        )
        
        # Last 7 days
        week_ago = today - timedelta(days=7)
        recent_bills = Bill.objects.filter(
            user=user,
            date__gte=week_ago
        )
        
        return Response({
            'current_month': {
                'total_bills': current_month_bills.count(),
                'total_amount': float(current_month_bills.aggregate(Sum('total_amount'))['total_amount__sum'] or 0),
            },
            'last_7_days': {
                'total_bills': recent_bills.count(),
                'total_amount': float(recent_bills.aggregate(Sum('total_amount'))['total_amount__sum'] or 0),
            },
            'all_time': {
                'total_bills': Bill.objects.filter(user=user).count(),
                'total_amount': float(Bill.objects.filter(user=user).aggregate(Sum('total_amount'))['total_amount__sum'] or 0),
            }
        })


class SuggestionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for AI suggestions
    """
    permission_classes = [IsAuthenticated]
    serializer_class = SuggestionSerializer
    
    def get_queryset(self):
        return Suggestion.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """
        Mark suggestion as read
        """
        suggestion = self.get_object()
        suggestion.is_read = True
        suggestion.save()
        return Response(self.get_serializer(suggestion).data)
    
    @action(detail=True, methods=['post'])
    def dismiss(self, request, pk=None):
        """
        Dismiss suggestion
        """
        suggestion = self.get_object()
        suggestion.is_dismissed = True
        suggestion.save()
        return Response(self.get_serializer(suggestion).data)
