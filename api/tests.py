import datetime
import json

from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.serializers import ValidationError
from rest_framework.test import APITestCase

from .models import Event, EventSchedule
from .serializers import EventScheduleSerializer, EventSerializer

# Test Date and Time for unit-testing
TODAY = datetime.datetime.now()
TOMMORROW = TODAY + datetime.timedelta(days=1)
YESTERDAY = TODAY + datetime.timedelta(days=-1)
ONE_HOUR_BEFORE_NOW = TODAY + datetime.timedelta(hours=-1)
ONE_HOUR_FROM_NOW = TODAY + datetime.timedelta(hours=1)
TWO_HOUR_FROM_NOW = TODAY + datetime.timedelta(hours=2)


class EventTestCase(APITestCase):
    """
    Test related to Event
    """

    class TestEventData:
        """
        Mock data for Event
        """

        def __init__(
            self,
            title="Test Event",
            description="This is test Event",
            type_of="OTA",
            is_scheduled=True,
            event_schedule=[],
        ):
            self.title = title
            self.description = description
            self.type_of = type_of
            self.is_scheduled = is_scheduled
            self.event_schedule = (
                event_schedule
                if len(event_schedule) != 0
                else [self.TestScheduleData()]
            )

        class TestScheduleData:
            """
            Mock data for schedule
            """

            def __init__(
                self,
                date=TOMMORROW.strftime("%Y-%m-%d"),
                time_starts_at=ONE_HOUR_FROM_NOW.strftime("%H:%M"),
                time_ends_at=TWO_HOUR_FROM_NOW.strftime("%H:%M"),
            ):
                self.date = date
                self.time_starts_at = time_starts_at
                self.time_ends_at = time_ends_at

            def get_dict(self):
                return {
                    "date": self.date,
                    "timeStartsAt": self.time_starts_at,
                    "timeEndsAt": self.time_ends_at,
                }

        def get_dict(self):
            return {
                "title": self.title,
                "description": self.description,
                "typeOf": self.type_of,
                "isScheduled": self.is_scheduled,
                "eventSchedule": [
                    schedule.get_dict() for schedule in self.event_schedule
                ],
            }

    def setUp(self):
        self.url = reverse("event-list")

    # TEST 1
    def test_event_create(self):
        """
        Ensures we can create a new event object with schedules.
        """
        data = self.TestEventData().get_dict()

        response = self.client.post(self.url, data, format="json")
        self.assertEqual(
            response.status_code, status.HTTP_201_CREATED, "object is not created"
        )

        event = Event.objects.get(id=1)
        self.assertEqual(event.title, "Test Event", "title doesn't match")
        self.assertEqual(
            event.description, "This is test Event", "description doesn't match"
        )
        event_schedule = event.event_schedule.all().first()
        self.assertEqual(
            event_schedule.date.strftime("%Y-%m-%d"),
            TOMMORROW.strftime("%Y-%m-%d"),
            "date doesn't match",
        )
        self.assertEqual(
            event_schedule.time_starts_at.strftime("%H:%M"),
            ONE_HOUR_FROM_NOW.strftime("%H:%M"),
            "start time doesn't match",
        )
        self.assertEqual(
            event_schedule.time_ends_at.strftime("%H:%M"),
            TWO_HOUR_FROM_NOW.strftime("%H:%M"),
            "end time doesn't match",
        )

    # TEST 2
    def test_event_date_error_1(self):
        """
        Testing whether if any schedule date is set to yesterday an error should arise
        """

        # New event data is generated
        new_event = self.TestEventData()

        # Date is set to day before current date's value
        new_event.event_schedule[0].date = YESTERDAY.strftime("%Y-%m-%d")

        data = new_event.get_dict()
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
            "status code wasn't an error",
        )

    # TEST 3
    def test_event_date_error_2(self):
        """
        Testing whether if any schedule date is set to yesterday an error should arise
        """

        # New event data is generated
        new_event = self.TestEventData()

        schedule_for_tommorrow = self.TestEventData().TestScheduleData()
        schedule_for_today = self.TestEventData().TestScheduleData()
        schedule_for_today.date = TODAY.strftime("%Y-%m-%d")

        new_event.event_schedule = [schedule_for_tommorrow, schedule_for_today]
        data = new_event.get_dict()
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
            "status code wasn't an error",
        )

    # TEST 4
    def test_event_time_error_1(self):
        """
        Test to check when starting time comes before ending time error is raised or not
        """

        new_event = self.TestEventData()
        new_event.event_schedule[0].time_starts_at = ONE_HOUR_BEFORE_NOW.strftime(
            "%H:%M"
        )
        new_event.event_schedule[0].time_ends_at = ONE_HOUR_FROM_NOW.strftime("%H:%M")

        data = new_event.get_dict()
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
            "status code wasn't an error",
        )

    # TEST 5
    def test_event_time_error_2(self):
        """
        Testing if date is set to today starting time shouldn't be less than current time
        """

        new_event = self.TestEventData()
        new_event.event_schedule[0].date = TODAY.strftime("%Y-%m-%d")
        new_event.event_schedule[0].time_starts_at = ONE_HOUR_BEFORE_NOW.strftime(
            "%H:%M"
        )

        data = new_event.get_dict()
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
            "status code wasn't an error",
        )

    # TEST 6
    def test_empty_schedule(self):
        """
        Test to ensure if 'is_scheduled' is set to false empty schedule date is possible to submit
        """

        new_event = self.TestEventData()
        new_event.is_scheduled = False
        new_event.event_schedule = []
        data = new_event.get_dict()
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(
            response.status_code, status.HTTP_201_CREATED, "object was not created"
        )
