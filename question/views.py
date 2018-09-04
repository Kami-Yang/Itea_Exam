import time
import json
import uuid

from django.http import HttpResponse
from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response

from app01 import models


def ques_page(request):
    return render(request, "question/ques.html")


"""
查询questions
@:param q_id 存在id，则查询某一个问题详细，不存在id，查询所有
@:param l_id 存在id，则根据题库id查询所有问题，不存在，查询所有问题
"""


class QueryQuestions(generics.GenericAPIView):
    def post(self, request):
        # 先判定是否存在库id，存在优先根据库查询
        lib_id = request.POST.get("l_id", "")
        result = []
        if lib_id:
            questions = models.QuestionLib.get(pk=uuid.UUID(lib_id)).question.objects.all()
            for question in questions:
                result.append({"id": str(question.id), "text": question.text, "que_type": question.que_type,
                               "steps": query_question_by_id(question.id)})
            return HttpResponse(json.dumps(result), content_type="application/json")
        # 再判断是否存在问题id，存在根据问题id单独查询
        qu_id = request.POST.get("q_id", "")
        if qu_id:
            return Response(query_question_by_id(qu_id), status=status.HTTP_200_OK)
        # 如果两个id都不存在，则查询所有问题
        else:
            questions = models.Question.objects.all().order_by("add_time")
            for question in questions:
                result.append({"id": str(question.id), "text": question.text, "que_type": question.que_type,
                               "steps": query_question_by_id(question.id)})
            print(result)
            return HttpResponse(json.dumps(result), content_type="application/json")


"""
@:param q_id 如果存在q_id,则根据q_id执行更新，不存在，则新增
"""


class SaveOrUpdateQue(generics.GenericAPIView):
    def post(self, request):
        data = request.POST
        if data.get("q_id", ""):
            question = models.Question.objects.get(pk=uuid.UUID(data.get("q_id", "")))
            text = data.get("text", "")
            # 存在text更新question
            if text:
                question.text = text
                # question.add_time = datetime.now()
                question.save()
            # 不存在text更新步骤
            if data.get("step_ids", ""):
                pass
        else:
            # 新增问题跟步骤
            text = data.get("text", "")
            if text:
                question = models.Question(text=text)
                question.save()
                # que_set = models.Question.objects.get(pk=question.id)
                steps = data.get("steps", "").split(";")
                if steps:
                    for step in steps:
                        st = models.Step()
                        attrs = step.split("//")
                        for attr in attrs:
                            setattr(st, attr.split(":")[0], attr.split(":")[1])
                        if st.importance == "Y":
                            st.importance = True
                        else:
                            st.importance = False
                        st.question_id = question.id
                        if st.detail and st.score:
                            st.save()
        return Response({"msg": True}, status=status.HTTP_201_CREATED)


class DeleteQue(generics.GenericAPIView):
    def post(self, request):
        q_ids = request.POST.get("ids", "").split(",")
        for q_id in q_ids:
            print(q_id)
            question = models.Question.objects.get(pk=uuid.UUID(q_id))
            question.steps.all().delete()
            question.delete()
        return Response({"msg": True}, status=status.HTTP_200_OK)


# 传入uuid，不是string
def query_question_by_id(qu_id):
    question = models.Question.objects.get(pk=qu_id)
    steps = []
    step_set = question.steps.all().order_by("step_num")
    for step in step_set:
        steps.append({"id": str(step.id), "step_num": step.step_num, "detail": step.detail,
                      "importance": step.importance, "step_class": step.step_class, "score": step.score})
    return steps


def update_step_by_question(q_id, step_id):
    pass

















