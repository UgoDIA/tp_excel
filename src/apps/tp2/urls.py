from django.contrib import admin
from django.urls import path, include
from . import views

app_name = "tp2"

urlpatterns = [
    path('', views.page_tp2, name='page_tp2'),
]