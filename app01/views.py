from django.shortcuts import render


# Create your views here.
from rest_framework import generics, status
from rest_framework.response import Response

from app01 import models


def index(request):
    return render(request, "app/login.html")


class LoginView(generics.GenericAPIView):
    def post(self, request):
        data = request.data
        username = data.get("username", "")
        password = data.get("password", "")
        user_query = models.Employee.objects.filter(username=username)

        if not user_query or len(user_query) != 1:
            return Response({"msg": "username is not exist", "status": False},
                            status=status.HTTP_403_FORBIDDEN)
        user = user_query[0]
        if password != user.password:
            return Response({"msg": "password is error", "status": False},
                            status=status.HTTP_403_FORBIDDEN)
        if user.role.level:
            return Response({"msg": "you are admin", "status": True},
                            status=status.HTTP_200_OK)
        # result = []
        # for key in dir(user):
        #     result.append(str(key), getattr(user, key))
        return Response({"msg": "you are user", "user": "is user", "status": True},
                        status=status.HTTP_200_OK)
