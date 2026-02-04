from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AnalyticsViewSet, SuggestionViewSet

router = DefaultRouter()
router.register(r'suggestions', SuggestionViewSet, basename='suggestion')
router.register(r'', AnalyticsViewSet, basename='analytics')

urlpatterns = [
    path('', include(router.urls)),
]
