from django.conf.urls import url

from . import views

# app_name = "employee"

urlpatterns = [
    # url('login_page/', views.LoginPageView.as_view()),
    url('admin_page/', views.AdminPage.as_view()),
    url('user_page/', views.UserPage.as_view()),
    url('emp_page/', views.emp_page, name='emp_page'),
    url('show_employee/', views.EmployView.as_view()),
    url('save_user/', views.SaveUser.as_view()),
    url('del_user/', views.DelUser.as_view()),
    url('record/', views.RecordByEmp.as_view()),
]
