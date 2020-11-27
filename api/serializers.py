from datetime import datetime

from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer as TokePairSerializer,
)
from rest_framework_simplejwt.serializers import TokenRefreshSerializer as TokenRefresh

from .models import Event, EventSchedule, User


class TokenObtainPairSerializer(TokePairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        return token


class TokenRefreshSerializer(TokenRefresh):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        return token


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


class EventScheduleSerializer(serializers.ModelSerializer):
    date = serializers.DateField(format="%d %b %Y", input_formats=["%Y-%m-%d"])
    time_starts_at = serializers.TimeField(format="%I:%M %p", input_formats=["%H:%M"])
    time_ends_at = serializers.TimeField(format="%I:%M %p", input_formats=["%H:%M"])

    class Meta:
        model = EventSchedule
        fields = ["id", "date", "time_starts_at", "time_ends_at"]


class EventSerializer(serializers.ModelSerializer):
    event_schedule = EventScheduleSerializer(many=True, required=False)
    event_status = serializers.SerializerMethodField()
    event_room_id = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            "id",
            "user",
            "title",
            "description",
            "type_of",
            "is_scheduled",
            "created_on",
            "event_schedule",
            "event_status",
        ]

    def get_event_status(self, obj):
        if obj.is_scheduled:
            day_of_event = obj.event_schedule.all().first()
            if day_of_event.date < datetime.now().date():
                return "Comming soon"
            elif day_of_event.date < datetime.now().date():
                return "Event Over"
        return "Event today"

    def get_event_room_id(self, obj):
        return "event-room-" + obj.id

    def validate(self, data):
        """
        If the event was scheduled, these sets of validation codes will run
        """
        if data["is_scheduled"]:
            event_schedule = data["event_schedule"]
            for schedule in event_schedule:

                # Checks whether the scheduled date doesn't comes before 'today's date'
                if schedule["date"] < datetime.now().date():
                    raise serializers.ValidationError(
                        "All the scheduled dates should be greater than or equal to today's date"
                    )

                # Checks whether the time is greater or equal to if date was today's date
                if (
                    schedule["date"] == datetime.now().date()
                    and schedule["time_starts_at"] < datetime.now().time()
                ):
                    raise serializers.ValidationError(
                        "Starting time shouldn't be less than current time"
                    )

                # Checks whether the given times for the scheduled date starts and ends properly
                if schedule["time_ends_at"] < schedule["time_starts_at"]:
                    raise serializers.ValidationError(
                        "Starting time should be before ending time"
                    )

            # Checks all the scheduled dates that are given whether if each one is greater than later
            for i in range(len(event_schedule)):
                if event_schedule[i]["date"] < event_schedule[i - 1]["date"] and i > 0:
                    raise serializers.ValidationError(
                        "Each scheduled date should greater than the previous one"
                    )
        return data

    def create(self, validated_data):
        """
        Custom 'create' function to add list of schedules
        """

        # Assumes to always get 'event_schedule' field even if 'is_schedule' is set to False
        events_schedules = validated_data.pop("event_schedule")
        event = Event.objects.create(**validated_data)
        if validated_data["is_scheduled"]:
            for schedule in events_schedules:
                EventSchedule.objects.create(event=event, **schedule)
        return event
