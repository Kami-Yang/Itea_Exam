from django.conf.urls import url

from . import views

urlpatterns = [
    # url("questions/", views.questions, name="questions"),
    # url("queryQues", views.query_ques, name="queryQues"),
    # url("saveQue/", views.SaveQue.as_view()),
    # url("del_que/", views.DelQue.as_view()),
    # url("edit_que/", views.EditQue.as_view()),
    url("to_ques/", views.ques_page, name="ques_page"),
    url("get_ques/", views.QueryQuestions.as_view()),
    url("save_que/", views.SaveOrUpdateQue.as_view()),
    url("del_que/", views.DeleteQue.as_view()),
]