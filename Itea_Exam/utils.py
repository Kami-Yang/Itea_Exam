import os
from aip import AipSpeech

real_path = os.getcwd()

def dic2obj(obj, dic):
    for key, value in dic.items():
        setattr(obj, key, value)
    return obj


def obj2dic(obj):
    dic = {}
    for key, value in dict(obj).items():
        if type(value).__name__ == 'UUID':
            dic[key] = str(value)
        else:
            dic[key] = value
    return dic




""" 你的 APPID AK SK """
APP_ID = '11749616'
API_KEY = 'RPbQGmRzpgQq0pqACTHH4hKM'
SECRET_KEY = 'hUSDXIWy4cAZ15qG3RknShqINk0Kp00O '


def to_audio(text):
    client = AipSpeech(APP_ID, API_KEY, SECRET_KEY)
    result = client.synthesis(text, 'zh', 1, {
        'vol': 5,
        'per': 1,
    })
    if not isinstance(result, dict):
        f = open("{0}media/{1}.mp3".format(real_path, text), "wb")
        f.write(result)
        f.close()
    return "{0}.mp3".format(text)
