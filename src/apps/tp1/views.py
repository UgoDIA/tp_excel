from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.contrib.auth.decorators import login_required
# Create your views here.


@login_required
def page_tp1(request):
    return render(request, 'tp1/tp1.html')