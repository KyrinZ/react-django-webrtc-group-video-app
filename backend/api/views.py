from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenObtainPairView as OriginalObtainPairView
from .models import Room
from .serializers import (
    RoomSerializer,
    TokenObtainPairSerializer,
    RegisterTokenSerializer,
)


class TokenObtainPairView(OriginalObtainPairView):
    """
    Replacing old 'serializer_class' with modified serializer class
    """

    serializer_class = TokenObtainPairSerializer


class RegisterAndObtainTokenView(APIView):

    """
    Register user. Only Post method is allowed
    """

    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request, format="json"):

        # User data is added to serializer class
        serializer = RegisterTokenSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            if user:
                json = serializer.data
                return Response(json, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RoomViewSet(viewsets.ModelViewSet):
    """
    Rooms View
    """

    queryset = Room.objects.all().order_by("-created_on")
    serializer_class = RoomSerializer

    def get_queryset(self):

        # By default list of rooms return
        queryset = Room.objects.all().order_by("-created_on")

        # If search params is given then list matching the param is returned
        search = self.request.query_params.get("search", None)
        if search is not None:
            queryset = Room.objects.filter(title__icontains=search).order_by(
                "-created_on"
            )
        return queryset

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action == "list" or self.action == "retrieve":
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def destroy(self, request, pk=None):

        """
        Checks whether user requesting a delete of the room is the owner of the room or not
        """
        room = get_object_or_404(Room, id=pk)

        if room:
            authenticate_class = JWTAuthentication()
            user, _ = authenticate_class.authenticate(request)
            if user.id == room.user.id:
                room.delete()
            else:
                return Response(
                    {
                        "message": "Either you are not logged in or you are not the owner of this room to delete"
                    },
                    status=status.HTTP_401_UNAUTHORIZED,
                )
        return Response({}, status=status.HTTP_204_NO_CONTENT)
