from django.urls import re_path

from . import consumers

# Video room route
websocket_urlpatterns = [
    re_path(r"video/(?P<room_name>\w+)/$", consumers.VideoConsumer.as_asgi()),
]