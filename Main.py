import time
import re
import webbrowser
from playsound import playsound

startTime = time.time()

def resetTime():
    global startTime
    startTime = time.time()

def oneMinLoop():
    global startTime
    nowTime = time.time()
    if nowTime - startTime >= 60 * 60:
        startTime = nowTime + 15 * 60
        webbrowser.open("http://127.0.0.1:5768/attention.html")
        for each in range(5):
            playsound("music/attention.wav")

def start():
    while(True):
        oneMinLoop()
        time.sleep(60)

if __name__ == "__main__":
    start()
    pass
