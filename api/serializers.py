from datetime import datetime

from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Room, User


class UserSerializerWithToken(serializers.ModelSerializer):
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

    def validate_password(self, value):
        validate_password(value)
        return value

    def create(self, validated_data):
        instance = self.Meta.model.objects.create_user(**validated_data)
        return instance


class RoomSerializer(serializers.ModelSerializer):
    room_id = serializers.SerializerMethodField()

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

    def get_room_id(self, obj):
        return "room" + str(obj.id)
