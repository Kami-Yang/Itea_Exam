from django.conf.urls import url

from . import views

urlpatterns = [
    url('begin_exam/', views.begin_exam, name='emp_page'),
    url("save_answer/", views.SaveRecord.as_view()),
    url("end_exam/", views.end_exam, name="end_exam"),
]
