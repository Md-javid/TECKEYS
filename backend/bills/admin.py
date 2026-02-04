from django.contrib import admin
from .models import Bill, BillItem, BillCorrection


class BillItemInline(admin.TabularInline):
    model = BillItem
    extra = 1


@admin.register(Bill)
class BillAdmin(admin.ModelAdmin):
    list_display = ['bill_number', 'vendor_name', 'user', 'date', 'total_amount', 'status', 'created_at']
    list_filter = ['status', 'date', 'created_at']
    search_fields = ['bill_number', 'vendor_name', 'user__username']
    inlines = [BillItemInline]
    readonly_fields = ['created_at', 'updated_at']


@admin.register(BillCorrection)
class BillCorrectionAdmin(admin.ModelAdmin):
    list_display = ['bill', 'field_name', 'original_value', 'corrected_value', 'created_at']
    list_filter = ['field_name', 'created_at']
    search_fields = ['bill__bill_number']
