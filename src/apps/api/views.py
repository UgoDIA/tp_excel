from django.shortcuts import render
from rest_framework import viewsets
from django.contrib.auth import get_user_model
from .serializers import *
from .models import *

User = get_user_model()


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class CalcSimpleViewSet(viewsets.ModelViewSet):

    queryset = CalcSimple.objects.all()
    serializer_class = CalcSimpleSerializer

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

class CategorieViewSet(viewsets.ModelViewSet):
    queryset = Categorie.objects.all()
    serializer_class = CategorieSerializer

class CoureurViewSet(viewsets.ModelViewSet):
    queryset = Coureur.objects.all()
    serializer_class = CoureurSerializer