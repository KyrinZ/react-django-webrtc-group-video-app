from uuid import uuid4

from django.contrib.auth.password_validation import (
    validate_password as original_pwd_validate,
)
from rest_framework import serializers
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer as OriginalObtainPairSerializer,
)

from .models import Room, User


class TokenObtainPairSerializer(OriginalObtainPairSerializer):
    """
    Custom Token pair generator, Added full_name field to tokens to access it on a frontend
    """

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["full_name"] = user.first_name + " " + user.last_name
        return token


class RegisterTokenSerializer(serializers.ModelSerializer):
    """
    User registers through this serializer an receive tokens for authentication
    """

    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    tokens = serializers.SerializerMethodField("getting_token", read_only=True)

    def getting_token(self, user):
        refresh = TokenObtainPairSerializer.get_token(user)
        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }

    class Meta:
        model = User
        fields = ("email", "first_name", "last_name", "password", "tokens")

    # Validates the password with django password validation
    def validate_password(self, value):
        original_pwd_validate(value)
        return value

    def create(self, validated_data):
        instance = self.Meta.model.objects.create_user(**validated_data)
        return instance


class RoomSerializer(serializers.ModelSerializer):

    """
    Room Serialiser
    """

    room_id = serializers.SerializerMethodField()
    created_on = serializers.DateTimeField(
        format="%a %I:%M %p, %d %b %Y", required=False
    )

    class Meta:
        model = Room
        fields = [
            "id",
            "user",
            "title",
            "description",
            "type_of",
            "created_on",
            "room_id",
        ]

    # Generate room id
    def get_room_id(self, obj):
        if obj.type_of == "IO":
            return "room" + str(uuid4().hex)
        return "room" + str(obj.id)
