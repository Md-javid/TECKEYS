from rest_framework import serializers
from .models import Bill, BillItem, BillCorrection


class BillItemSerializer(serializers.ModelSerializer):
    """
    Serializer for bill items
    """
    class Meta:
        model = BillItem
        fields = ('id', 'name', 'quantity', 'unit_price', 'total_price', 'category', 'created_at')
        read_only_fields = ('id', 'created_at')


class BillSerializer(serializers.ModelSerializer):
    """
    Serializer for bills
    """
    items = BillItemSerializer(many=True, read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Bill
        fields = ('id', 'user', 'user_name', 'bill_number', 'vendor_name', 'date',
                  'total_amount', 'tax_amount', 'image', 'ocr_data', 'status',
                  'notes', 'items', 'created_at', 'updated_at')
        read_only_fields = ('id', 'user', 'created_at', 'updated_at')


class BillCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating bills with items
    """
    items = BillItemSerializer(many=True, required=False)
    
    class Meta:
        model = Bill
        fields = ('bill_number', 'vendor_name', 'date', 'total_amount', 'tax_amount',
                  'image', 'ocr_data', 'status', 'notes', 'items')
    
    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        bill = Bill.objects.create(**validated_data)
        
        for item_data in items_data:
            BillItem.objects.create(bill=bill, **item_data)
        
        return bill


class BillUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating bills
    """
    items = BillItemSerializer(many=True, required=False)
    
    class Meta:
        model = Bill
        fields = ('bill_number', 'vendor_name', 'date', 'total_amount', 'tax_amount',
                  'status', 'notes', 'items')
    
    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', None)
        
        # Update bill fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update items if provided
        if items_data is not None:
            # Delete existing items
            instance.items.all().delete()
            # Create new items
            for item_data in items_data:
                BillItem.objects.create(bill=instance, **item_data)
        
        return instance


class BillCorrectionSerializer(serializers.ModelSerializer):
    """
    Serializer for bill corrections
    """
    class Meta:
        model = BillCorrection
        fields = ('id', 'bill', 'field_name', 'original_value', 'corrected_value', 'created_at')
        read_only_fields = ('id', 'created_at')
