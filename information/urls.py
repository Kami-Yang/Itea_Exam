from django.conf.urls import url

from . import views

urlpatterns = [
    url('query_info/', views.query_info, name='open_page'),
    url('admin_page/', views.open_admin, name='open_admin'),
    url("index/", views.open_materials, name="open_materials"),
    url('save_info/', views.SaveInfo.as_view()),
]
