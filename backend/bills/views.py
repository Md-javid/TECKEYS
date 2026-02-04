from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from .models import Bill, BillItem, BillCorrection
from .serializers import (
    BillSerializer, BillCreateSerializer, BillUpdateSerializer,
    BillCorrectionSerializer
)


class BillViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing bills
    """
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Users can only see their own bills
        queryset = Bill.objects.filter(user=self.request.user).prefetch_related('items')
        
        # Filter by status
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Filter by date range
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)
        
        # Search
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(bill_number__icontains=search) |
                Q(vendor_name__icontains=search) |
                Q(notes__icontains=search)
            )
        
        return queryset
    
    def get_serializer_class(self):
        if self.action == 'create':
            return BillCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return BillUpdateSerializer
        return BillSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def correct(self, request, pk=None):
        """
        Record a correction for a bill field
        """
        bill = self.get_object()
        field_name = request.data.get('field_name')
        original_value = request.data.get('original_value')
        corrected_value = request.data.get('corrected_value')
        
        if not all([field_name, original_value, corrected_value]):
            return Response(
                {'error': 'field_name, original_value, and corrected_value are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        correction = BillCorrection.objects.create(
            bill=bill,
            field_name=field_name,
            original_value=original_value,
            corrected_value=corrected_value
        )
        
        # Update the bill field
        if hasattr(bill, field_name):
            setattr(bill, field_name, corrected_value)
            bill.status = 'corrected'
            bill.save()
        
        return Response(
            BillCorrectionSerializer(correction).data,
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """
        Get bill statistics
        """
        queryset = self.get_queryset()
        
        total_bills = queryset.count()
        total_amount = sum(bill.total_amount for bill in queryset)
        total_tax = sum(bill.tax_amount for bill in queryset)
        
        return Response({
            'total_bills': total_bills,
            'total_amount': float(total_amount),
            'total_tax': float(total_tax),
            'average_amount': float(total_amount / total_bills) if total_bills > 0 else 0
        })
