from django.urls import path
from . import views

app_name = 'authentification'

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('register/', views.register_view, name='register'),
    path('users/', views.page_users, name='page_users')
]