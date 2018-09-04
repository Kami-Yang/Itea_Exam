
import uuid

from django.db import models


# Create your models here.
from django.utils import timezone


class Question(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, null=False)
    text = models.TextField(verbose_name="question", max_length=1000, unique=True)
    add_time = models.DateTimeField(default=timezone.now)
    """
    判断题选项及正确答案
    """
    # option_a = models.CharField(verbose_name="option_a", max_length=64, null=True)
    # option_b = models.CharField(verbose_name="option_b", max_length=64, null=True)
    # option_c = models.CharField(verbose_name="option_c", max_length=64, null=True)
    # option_d = models.CharField(verbose_name="option_d", max_length=64, null=True)
    # right_key = models.CharField(verbose_name="right key", max_length=64, null=True)
    """
    填空题答案
    """
    # answer = models.CharField(verbose_name="Completion answer", max_length=64)
    """
    判断题答案
    """
    # is_right = models.BooleanField(verbose_name="Judgment problem answer", default=0)

    # TYPE_CHOICE = (
    #     # (1, "Choice question 选择题"),
    #     # (2, "Completion 填空题"),
    #     # (3, "Judgment problem 判断题"),
    #     (4, "Operation Questions 操作题")
    # )
    que_type = models.CharField(max_length=1, null=False, default=4)

    class Meta:
        verbose_name = 'the questions'


class Step(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="steps", blank=True)
    CLASS_CHOICES = (
        ("A", "A"),
        ("B", "B"),
        ("C", "C"),
        ("D", "D"),
        ("E", "E"),
        ("F", "F"),
        ("G", "G")
    )
    step_class = models.CharField(choices=CLASS_CHOICES, default="A", max_length=1)
    step_num = models.IntegerField(null=False, default=1)
    detail = models.CharField(max_length=128, null=False)
    importance = models.BooleanField(default=0)
    score = models.FloatField(null=False, default=2.0)

    class Meta:
        verbose_name = "the detail step of Operation Questions"


class QuestionLib(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(verbose_name="lib name", max_length=64, unique=True)
    question = models.ManyToManyField(Question, related_name="question_lib")
    TYPE_CHOICES = (
        (1, "Operation Questions lib"),
        (0, "not Operation Questions lib")
    )
    lib_type = models.BooleanField(choices=TYPE_CHOICES, default=1)

    class Meta:
        verbose_name = 'the lib of question'


class Role(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    LEVEL_CHOICES = (
        (0, "user"),
        (1, "admin")
    )
    level = models.IntegerField(null=False, unique=True, default=0, choices=LEVEL_CHOICES)


class Employee(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=16, null=False, unique=True)
    password = models.CharField(max_length=128, null=False)
    # name = models.CharField(max_length=32, verbose_name="name", null=False)
    # join_date = models.DateTimeField(verbose_name="date of join", default=timezone.now)
    role = models.ForeignKey(Role, on_delete=models.CASCADE, related_name="employee")

    class Meta:
        verbose_name = "employee"


class ExamRecord(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(verbose_name="name", null=True, max_length=32)
    join_date = models.DateTimeField(verbose_name="join date", null=False, default=timezone.now, blank=True)
    score = models.IntegerField(verbose_name="score", default=0)
    exam_date = models.DateTimeField(verbose_name="date of exam", default=timezone.now, blank=True, null=False)
    # question_answer = models.TextField(null=True, blank=True)
    assessor = models.CharField(verbose_name="assessor", null=False, max_length=32, default="sys_root")
    is_pass = models.BooleanField(default=0, verbose_name="is pass ?")
    exam_count = models.IntegerField(verbose_name="count of exam", default=1)

    class Meta:
        verbose_name = "the record of exam"

    # def answer_as_list(self):
    #     """
    #     self.question_answer：
    #         question/answer;question/answer;...
    #     :return:
    #     """
    #     answers = self.question_answer.split(";")
    #     result = []
    #     if answers:
    #         for answer in answers:
    #             if answer:
    #                 arr = answer.split("/")
    #                 result.append(Answer(arr[0], arr[1], arr[2]))
    #     return result


class AnswerRecord(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    exam = models.ForeignKey(ExamRecord, related_name="answer", on_delete=models.CASCADE)
    question = models.ForeignKey(Question, related_name="answer",
                                 on_delete=models.CASCADE, blank=True)
    step = models.ForeignKey(Step, related_name="answer",
                             on_delete=models.CASCADE, blank=True)
    is_right = models.BooleanField(default=1)
    remark = models.CharField(max_length=64, null=True, blank=True)
    score = models.FloatField(null=False, default=0)

    class Meta:
        verbose_name = "every answer of exam record"


class Information(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ch_name = models.CharField(max_length=128, verbose_name="chinese")
    en_name = models.CharField(max_length=256, verbose_name="english")
    INFO_CHOICES = (
        (1, "Commonly Use Words"),
        (2, "Commonly Use Words Menu")
    )
    info_type = models.IntegerField(choices=INFO_CHOICES, default=2)
    info_type_name = models.CharField(default="Commonly Use Words Menu", max_length=32)
    file_path = models.CharField(max_length=256)
    file_name = models.CharField(max_length=256)


class Answer(object):
    def __init__(self, question, answer, is_right):
        self.question = question
        self.answer = answer
        self.right = is_right
