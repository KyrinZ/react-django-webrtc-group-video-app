from django.urls import path
from rest_framework import routers

from .views import (
    EventViewSet,
    LoginAndObtainTokenView,
    RegisterAndObtainTokenView,
    TokenRefreshView,
)

router = routers.DefaultRouter()
router.register(r"events", EventViewSet)
urlpatterns = router.urls

urlpatterns += [
    path("user/create/", RegisterAndObtainTokenView.as_view(), name="create_user"),
    path("token/", LoginAndObtainTokenView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
