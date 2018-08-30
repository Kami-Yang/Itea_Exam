import json
import uuid

from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.
from rest_framework import generics, status
from rest_framework.response import Response

from Itea_Exam.utils import obj2dic, dic2obj
from app01.models import Question, Step


def questions(request):
    return render(request, "question/ques.html")


def query_ques(request):
    que_type = request.POST.get("type", "")
    if que_type:
        ques = Question.objects.filter(que_type=que_type).order_by("que_type").values()
    else:
        ques = Question.objects.all().values()
    if not ques:
        return HttpResponse(json.dumps(None), content_type="application/json")
    # result = []
    # for que in ques:
    #     result.append({"id": str(que.id), "text": que.text})
    result = []
    for que in ques:
        js = obj2dic(que)
        result.append(js)
    return HttpResponse(json.dumps(result), content_type="application/json")


class SaveQue(generics.GenericAPIView):
    def post(self, request):
        dic = request.data
        if dic.get("que_type", "") == 4:
            qu = Question(text=dic.get("text", ""))
            steps = dic.get("steps", "").split(";");
            for step in steps:
                st = Step()
                pass
        else:
            qu = dic2obj(Question(), dic)
            qu.save()
        return Response({"msg": "true"}, status=status.HTTP_200_OK)


class DelQue(generics.GenericAPIView):
    def post(self, request):
        q_ids = request.POST.get("ids", "")
        ids = q_ids.split(",")
        for qid in ids:
            uid = uuid.UUID(qid)
            que = Question.objects.get(pk=uuid.UUID(qid))
            # l_q = LibQue.objects.filter(que_id=uuid.UUID(qid))
            if not que.question_lib.all():
                # l_q.delete()
                que.question_lib.clear()
            if que:
                que.delete()
        return Response({"msg": "true"}, status=status.HTTP_200_OK)


class EditQue(generics.GenericAPIView):
    def post(self, request):
        # qid = request.POST.get("q_id", "")
        # text = request.POST.get("text", "")
        # type = request.POST.get("type", "")
        # que = Question()
        # que.id = qid
        # que.text = text
        # if type:
        #     que.type = type
        # que.save()
        # return Response({"msg": "true"}, status=status.HTTP_200_OK)
        que = dic2obj(Question(), request.POST)
        que.save()
        return Response({"msg":True}, status=status.HTTP_200_OK)
