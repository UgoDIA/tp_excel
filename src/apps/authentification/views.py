from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from django.urls import reverse
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.decorators import login_required
from django.contrib import messages




def login_view(request):
    if request.user.is_authenticated:
        return redirect(reverse('tp1:page_tp1'))
    elif request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        print(f"Auth en cours de user {username}")

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect(reverse('tp1:page_tp1'))
        else:
            messages.error(request, ("Identifiant et/ou mot de passe incorrect(s)"))
            return redirect(reverse('authentification:login'))
    else:
        return render(request, 'authentification/login.html')



def logout_view(request):
    logout(request)
    messages.success(request, ("Session déconnectée"))
    return redirect('authentification:login')


@login_required
def page_users(request):
    return render(request, 'authentification/users.html')
