import json
import uuid
from datetime import datetime

from django.http import HttpResponse
from django.shortcuts import render
# Create your views here.
from rest_framework import generics, status
from rest_framework.response import Response

from app01 import models


class AdminPage(generics.GenericAPIView):
    def get(self, request):
        return render(request, "employee/admin.html")


class UserPage(generics.GenericAPIView):
    def get(self, request):
        # user_id = request.GET.get("userId")
        # user = models.Employee.objects.get(pk=user_id)
        return render(request, "employee/user.html")


def emp_page(request):
    return render(request, "employee/employees.html")


class ExamRecordView(generics.GenericAPIView):
    def post(self, request):
        records = models.ExamRecord.objects.all()
        result = []
        for record in records:
            result.append({"id": str(record.id), "name": record.name,
                           "join_date": record.join_date.strftime('%Y-%m-%d'),
                           "score": record.score, "exam_count": record.exam_count, "is_pass": record.is_pass,
                           "exam_date": record.exam_date.strftime('%Y-%m-%d')})
        return HttpResponse(json.dumps(result), content_type="application/json")


class DelRecord(generics.GenericAPIView):
    def post(self, request):
        ids = request.POST.get("ids", "").split(",")
        for e_id in ids:
            models.ExamRecord.objects.get(pk=uuid.UUID(e_id)).delete()
        return Response({"msg": True}, status=status.HTTP_200_OK)


class QueryDetail(generics.GenericAPIView):
    def post(self, request):
        r_id = request.POST.get("r_id", "")
        record = models.ExamRecord.objects.get(pk=uuid.UUID(r_id))
        answers = record.answer.all()
        result = []
        score = 0
        for ans in answers:
            step = ans.step
            score += step.score
            question = ans.question
            result.append({"question": question.text, "step": ans.step.detail, "score": ans.score,
                           "is_pass": ans.is_right, "remarks": ans.remark})
        result.append({"question": "Total", "score": score, "is_pass": record.is_pass})
        return HttpResponse(json.dumps(result), content_type="application/json")
