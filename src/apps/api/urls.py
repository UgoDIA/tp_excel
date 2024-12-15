from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register('users', viewset=views.UserViewSet)
app_name = "api"

urlpatterns = [
    path('api/', include(router.urls)),
]
