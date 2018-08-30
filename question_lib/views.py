import json
import uuid

from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.
from rest_framework import generics, status
from rest_framework.response import Response

from Itea_Exam.utils import obj2dic
from app01 import models


def libs(request):
    return render(request, "questionlib/libs.html")


def query_lib(request):
    que_libs = models.QuestionLib.objects.all().values()
    result = []
    for lib in que_libs:
        qu_lib = models.QuestionLib.objects.get(pk=uuid.UUID(str(lib["id"])))
        lib["questions"] = len(qu_lib.question.all())
        result.append(obj2dic(lib))
    return HttpResponse(json.dumps(result), content_type="application/json")


class SaveLib(generics.GenericAPIView):

    def post(self, request):
        name = request.POST.get("name", "")
        que_ids = request.POST.get("que_ids", "")
        que_lib = models.QuestionLib(name=name)
        que_lib.save()
        ids = que_ids.split(",")
        for q_id in ids:
            if q_id:
                question = models.Question.objects.get(pk=uuid.UUID(q_id))
                que_lib.question.add(question)
        return Response({"msg": True}, status=status.HTTP_201_CREATED)


class DelLib(generics.GenericAPIView):

    def post(self, request):
        ids = request.POST.get("ids", "").split(",")
        for l_id in ids:
            if l_id:
                q_lib = models.QuestionLib.objects.get(pk=uuid.UUID(l_id))
                q_lib.question.clear()
                q_lib.delete()
        return Response({"msg": True}, status=status.HTTP_200_OK)


class QueLibNoQues(generics.GenericAPIView):

    def post(self, request):
        l_id = request.POST.get("id", "")
        question_lib = models.QuestionLib.objects.get(pk=uuid.UUID(l_id))
        questions = models.Question.objects.exclude(question_lib=question_lib)
        result = []
        for question in questions:
            result.append({"id": str(question.id), "text": question.text, "que_type": question.que_type})
        return HttpResponse(json.dumps(result), content_type="application/json")


class SaveAddQue(generics.GenericAPIView):

    def post(self, request):
        lib_id = request.POST.get("libId", "")
        q_ids = request.POST.get("qids", "").split(",")
        q_lib = models.QuestionLib.objects.get(pk=uuid.UUID(lib_id))
        for q_id in q_ids:
            q_lib.question.add(models.Question.objects.get(pk=uuid.UUID(q_id)))
        return Response({"msg": True}, status=status.HTTP_200_OK)


class QueryLibQues(generics.GenericAPIView):

    def post(self, request):
        l_id = request.POST.get("id")
        questions = models.QuestionLib.objects.get(pk=uuid.UUID(l_id)).question.all().values()
        result = []
        for question in questions:
            result.append(obj2dic(question))
        return HttpResponse(json.dumps(result), content_type="application/json")


class SaveDelQues(generics.GenericAPIView):

    def post(self, request):
        l_id = request.POST.get("libId")
        q_ids = request.POST.get("qids").split(",")
        question_lib = models.QuestionLib.objects.get(pk=uuid.UUID(l_id))
        for q_id in q_ids:
            question_lib.question.remove(models.Question.objects.get(pk=uuid.UUID(q_id)))
        return Response({"msg": True}, status=status.HTTP_200_OK)
