from django.contrib import admin
from django.urls import path, include
from . import views

app_name = "main"

urlpatterns = [
    path('', views.redirection, name='redirection'),
    path('tp_excel/', views.page_main, name='index'),
]
