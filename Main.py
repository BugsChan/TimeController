import time
import re
import webbrowser

startTime = time.time()

def oneMinLoop():
    nowTime = time.time()
    if nowTime - startTime >= 60 * 60:
        startTime = nowTime + 15 * 60
        webbrowser.open("http://127.0.0.1:5768/attention.html")

def start():
    while(True):
        time.sleep(60)
        oneMinLoop()

if __name__ == "__main__":
    start()
    pass
