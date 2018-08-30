from django.conf.urls import url

from . import views


urlpatterns = [
    url('index/', views.index, name='index'),
    url('login/', views.LoginView.as_view()),
]