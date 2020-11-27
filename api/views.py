from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Room
from .serializers import RoomSerializer, UserSerializerWithToken


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


class RoomViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    authentication_classes = []

    queryset = Room.objects.all()
    serializer_class = RoomSerializer
