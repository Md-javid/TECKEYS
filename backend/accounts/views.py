from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .serializers import UserRegistrationSerializer, UserSerializer, UserUpdateSerializer

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """
    User registration endpoint
    """
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserRegistrationSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)


class CurrentUserView(APIView):
    """
    Get current authenticated user details
    """
    permission_classes = (IsAuthenticated,)
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class UpdateProfileView(generics.UpdateAPIView):
    """
    Update user profile
    """
    permission_classes = (IsAuthenticated,)
    serializer_class = UserUpdateSerializer
    
    def get_object(self):
        return self.request.user
