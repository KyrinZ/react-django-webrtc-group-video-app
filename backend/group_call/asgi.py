# group_call/asgi.py
import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
import video_signalling.routing
import django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "group_call.settings")

django.setup()

application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": AuthMiddlewareStack(
            URLRouter(video_signalling.routing.websocket_urlpatterns)
        ),
    }
)
