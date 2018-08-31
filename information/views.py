import json
import uuid

import os
from django.http import HttpResponse
from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response

from Itea_Exam.utils import to_audio, real_path
from app01 import models


def query_info(request):
    info_type = request.GET.get("type")
    if not info_type:
        infomations = models.Information.objects.all()
    else:
        infomations = models.Information.objects.filter(info_type=info_type)
    result = []
    for info in infomations:
        result.append({"id": str(info.id), "info_type": info.info_type, "ch_name": info.ch_name, "en_name": info.en_name,
                       "file_path": info.file_path, "file_name": info.file_name})
    return HttpResponse(json.dumps(result), content_type="application/json")


def open_admin(request):
    return render(request, "information/admin_materials.html")


def open_materials(request):
    info_type = request.GET.get("type")
    if not info_type:
        infomations = models.Information.objects.all()
    else:
        infomations = models.Information.objects.filter(info_type=info_type)
    return render(request, "information/show_materials.html", {"informations": infomations})


class SaveInfo(generics.GenericAPIView):

    def post(self, request):
        # file = request.FILES.get('up_file')
        info_type = request.POST.get("type", "")
        ch_name = request.POST.get("ch_name", "")
        en_name = request.POST.get("en_name", "")
        info = models.Information()
        # info.file_name = file.name
        info.ch_name = ch_name
        info.en_name = en_name
        info.info_type = info_type
        if info_type == "1":
            info.info_type_name = "Commonly Use Words"
        else:
            info.info_type_name = "Commonly Use Words Menu"
        info.file_path = "../../static/media/{0}.mp3".format(en_name)
        info.file_name = to_audio(en_name)
        print(info.file_name)
        info.save()
        return Response({"msg": "true"}, status=status.HTTP_200_OK)


class DelInfo(generics.GenericAPIView):
    def post(self, request):
        ids = request.POST.get("ids", "").split(",")
        for info_id in ids:
            info = models.Information.objects.get(pk=uuid.UUID(info_id))
            path = "{0}/information/static/media/{1}".format(real_path, info.file_name)
            try:
                os.remove(path)
            except FileNotFoundError as e:
                print(e.errno)
            info.delete()
        return Response({"msg": True}, status=status.HTTP_200_OK)
