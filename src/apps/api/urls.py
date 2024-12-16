from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register('users', viewset=views.UserViewSet)
router.register('calc_simple', viewset=views.CalcSimpleViewSet)
router.register('coureur', viewset=views.CoureurViewSet)
router.register('categorie', viewset=views.CategorieViewSet)
router.register('course', viewset=views.CourseViewSet)
app_name = "api"

urlpatterns = [
    path('api/', include(router.urls)),
]
