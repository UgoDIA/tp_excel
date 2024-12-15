from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.contrib.auth.decorators import login_required
# Create your views here.

def redirection(request):
    return HttpResponseRedirect(reverse('main:index'))


@login_required
def page_main(request):
    return render(request, 'main/index.html')
