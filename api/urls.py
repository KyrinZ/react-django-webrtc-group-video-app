from django.urls import path
from rest_framework import routers
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView

from .views import RegisterAndObtainTokenView, RoomViewSet, TokenObtainPairView

# Rooms url
router = routers.DefaultRouter()
router.register(r"rooms", RoomViewSet)
urlpatterns = router.urls
# Authentications Urls
urlpatterns += [
    path("user/create/", RegisterAndObtainTokenView.as_view(), name="create_user"),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("token/verify/", TokenVerifyView.as_view(), name="token_verify"),
]
