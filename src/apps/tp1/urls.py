from django.contrib import admin
from django.urls import path, include
from . import views

app_name = "tp1"

urlpatterns = [
    path('', views.page_tp1, name='page_tp1'),
]
