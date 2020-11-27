# mysite/asgi.py
import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
import video_signalling.routing

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "video_conference.settings")

application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": AuthMiddlewareStack(
            URLRouter(video_signalling.routing.websocket_urlpatterns)
        ),
    }
)
