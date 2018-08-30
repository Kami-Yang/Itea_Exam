import json

from django.db.models import Q
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


class EmployView(generics.GenericAPIView):
    def post(self, request):
        employees = models.Employee.objects.filter(~Q(username="root"))
        result = []
        for emp in employees:
            # print(emp.employee.all())
            # records = emp.exam_record.all()
            js = {"id": str(emp.id), "join_date": emp.join_date.strftime("%Y-%m-%d"),
                  "name": emp.name, "role_id": str(emp.role.id), "username": emp.username,
                  "password": emp.password}
            result.append(js)
        return HttpResponse(json.dumps(result), content_type="application/json")


class SaveUser(generics.GenericAPIView):
    def post(self, request):
        user_id = request.POST.get("user_id", "")
        name = request.POST.get("name", "")
        username = request.POST.get("username", "")
        password = request.POST.get("password", "")
        join_date = request.POST.get("join_date", "")
        if user_id:
            user = models.Employee.objects.get(pk=user_id)
            if name:
                user.name = name
            if username:
                user.username = username
            if password:
                user.password = password
        else:
            user = models.Employee()
            if join_date:
                user.join_date = join_date
            user.role = models.Role.objects.get(level=0)
            user.name = name
            user.username = username
            user.password = password
        user.save()
        return Response({"status": True}, status=status.HTTP_200_OK)


class DelUser(generics.GenericAPIView):
    def post(self, request):
        user_id = request.POST.get("user_id", "")
        if user_id:
            user = models.Employee.objects.get(pk=user_id)
            user.delete()
            return Response({"status": True}, status=status.HTTP_200_OK)
        return Response({"status": False}, status=status.HTTP_304_NOT_MODIFIED)


class RecordByEmp(generics.GenericAPIView):
    def post(self, request):
        user_id = request.POST.get("user_id", "")
        records = models.Employee.objects.get(pk=user_id).exam_record.all().order_by("exam_count")
        result = []
        for rec in records:
            result.append({"id": rec.id, "score": rec.score,
                           "exam_date": rec.exam_date.strftime("%Y-%m-%d"),
                           "lib_name": rec.lib_name, "question_answer": rec.question_answer,
                           "is_pass": rec.is_pass, "exam_count": rec.exam_count})
        return Response(result, status=status.HTTP_200_OK)

    def get(self, request):
        r_id = request.GET.get("id", "")
        record = models.ExamRecord.objects.get(pk=r_id)
        return render(request, "employee/show_record.html", {"record": record})
