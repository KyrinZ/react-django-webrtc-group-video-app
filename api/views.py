from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView as Refresh


from .models import Event
from .serializers import (
    EventSerializer,
    TokenObtainPairSerializer,
    UserSerializerWithToken,
    TokenRefreshSerializer,
)


class TokenRefreshView(Refresh):
    serializer_class = TokenRefreshSerializer


class LoginAndObtainTokenView(TokenObtainPairView):
    serializer_class = TokenObtainPairSerializer


class RegisterAndObtainTokenView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request, format="json"):
        serializer = UserSerializerWithToken(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                json = serializer.data
                return Response(json, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EventViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    authentication_classes = []
    """
    When request is 'post', 'save()' method for Event will also save EventSchedule data in the database
    """

    queryset = Event.objects.all()
    serializer_class = EventSerializer
