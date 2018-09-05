import json
import uuid
from datetime import datetime

from django.http import HttpResponse
from django.shortcuts import render
# Create your views here.
from rest_framework import generics, status
from rest_framework.response import Response

from app01 import models


def begin_exam(request):
    name = request.GET.get("name", "")
    assessor = request.GET.get("assessor", "")
    join_date = request.GET.get("join_date", "")
    exam_date = request.GET.get("exam_date", "")
    record = models.ExamRecord()
    record.name = name
    record.assessor = assessor
    record.join_date = datetime.strptime(join_date, '%Y-%m-%d')
    if exam_date:
        record.exam_date = datetime.strptime(exam_date, '%Y-%m-%d')
    count = models.ExamRecord.objects.filter(name=name, join_date=join_date).count()
    record.exam_count = count + 1
    record.save()
    return render(request, "exam/exam.html", {"record_id": str(record.id)})


class SaveRecord(generics.GenericAPIView):
    def post(self, request):
        q_id = request.POST.get("q_id", "")
        s_id = request.POST.get("s_id", "")
        r_id = request.POST.get("r_id", "")
        is_right = request.POST.get("is_right", "")
        remark = request.POST.get("remark", "")
        score = request.POST.get("score", "")
        answer = models.AnswerRecord()
        answer.exam = models.ExamRecord.objects.get(pk=uuid.UUID(r_id))
        answer.step = models.Step.objects.get(pk=uuid.UUID(s_id))
        answer.question = models.Question.objects.get(pk=uuid.UUID(q_id))
        answer.is_right = is_right
        answer.score = float(score)
        answer.remark = remark
        answer.save()
        exam = models.ExamRecord.objects.get(pk=uuid.UUID(r_id))
        score = exam.score + float(score)
        exam.score = score
        exam.save()
        return Response({"msg": True}, status=status.HTTP_201_CREATED)


def end_exam(request):
    e_id = request.POST.get("e_id", "")
    # steps = models.AnswerRecord.objects.get(pk=uuid.UUID(e_id)).answer.all()
    result = []
    score = 0
    is_p = True
    all_score = 0
    questions = models.Question.objects.all().order_by("add_time")
    for question in questions:
        answers = models.AnswerRecord.objects.filter(exam=e_id, question=question.id)
        for ans in answers:
            score += ans.score
            all_score += ans.step.score
            if not ans.is_right and ans.step.importance:
                is_p = False
            result.append({"question": question.text, "step": ans.step.detail, "score": ans.score,
                           "is_pass": ans.is_right, "remarks": ans.remark})
    e_r = models.ExamRecord.objects.get(pk=uuid.UUID(e_id))
    e_r.score = score
    print((score / all_score) * 100)
    if (score / all_score) * 100 >= 90 and is_p:
        e_r.is_pass = True
    e_r.save()
    result.append({"question": "Total", "score": score})
    return HttpResponse(json.dumps(result), content_type="application/json")
