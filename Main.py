import time
import re

hasDayLoop = False
info = None
loopTime = 0

class Infomation:
    def __init__(self, fromLog = True):
        if fromLog:
            with open("tmp.log", "r", encoding="utf-8") as file:
                for each in file:
                    if each.startswith("#") or each.find("=") < 0:
                        continue
                    tmp = each.replace(" ", "").replace("\n", "")
                    tmp = tmp.split("=")
                    setattr(self, tmp[0], int(tmp[1]))
            #对当前时间的记录，用于校准
            nowTime = time.localtime(time.time())
            self.nowMinutes = nowTime.tm_hour * 60 + nowTime.tm_min
            if self.restTime <= 0 and nowTime.tm_mday == self.day and nowTime.tm_mon == self.month:
                import os
                if os.name.find('nt') >= 0:
                    os.system("shutdown -s -t 0")
                else:
                    os.system("shutdown now")
        else:
            nowDate = time.localtime(time.time())
            self.year = nowDate.tm_year
            self.month = nowDate.tm_mon
            self.day = nowDate.tm_mday
            self.week_day = nowDate.tm_wday
            self.monthUse = 0
            self.dayUse = 0
            self.yearUse = 0


    def writeToLog(self):
        file = open("tmp.log", "r", encoding="utf-8")
        writeContent = ''
        attrs = dir(self)
        for each in file:
            for i in attrs:
                if i in each:
                    each = re.sub("\\b\d+\\b", str(getattr(self, i)), each)
            writeContent += each
        file.close()
        file = open("tmp.log", "w", encoding="utf-8")
        file.write(writeContent)
        file.close()

    def equal(self, otherInfo):
        comparation = ("year", "month", "day")
        for each in comparation:
            if getattr(self, each) != getattr(otherInfo, each):
                return False
        return True

    def refresh(self, nowDate):
        refresh_attributes = ["day", "month", "year"]

        def refreshByAttributes(refresh_attributes):
            changed = []
            for each in refresh_attributes:
                if getattr(self, each) != getattr(nowDate, each):
                    setattr(self, each, getattr(nowDate, each))
                    changed.append(each)
            return changed

        changed = refreshByAttributes(refresh_attributes)
        refresh_attributes.clear()
        if len(changed) != 0:
            self.restTime = self.autoExitTime
        for each in changed:
            refresh_attributes.append(each + 'Use')

        refreshByAttributes(refresh_attributes)

    def refreshRestTime(self):
        #该方法用于设置关机倒计时
        # 将剩余时间(restTime)设置为“当前时间”到“自动关机时间”的间隔
        nowTime = time.localtime(time.time())
        hour = nowTime.tm_hour
        minute = nowTime.tm_min
        # 校准时间
        nowMinutes = hour * 60 + minute
        if nowMinutes != self.nowMinutes:
            self.restTime -= nowMinutes - self.nowMinutes
            self.nowMinutes = nowMinutes
        restTime = (self.closeTimeHour - hour) * 60
        restTime += self.closeTimeMinute - minute
        #如果当日最长开机时间小于关机倒计时，则将关机倒计时设置为当日最长开机时间。
        if self.autoExitTime < restTime:
            restTime = self.autoExitTime;
        elif restTime < 0:
            restTime = 0
        if restTime < self.restTime:
            self.restTime = restTime
        elif self.restTime < 0:
            self.restTime = 0

    def timeAppend(self, min):
        self.dayUse += min
        self.monthUse += min
        self.yearUse += min
        self.totleUse += min
        self.nowMinutes += min

def dayLoop():
    """
    获取当前文件记录，并写入info中
    如果当前记录的日期与今天的日期一致，则不做改变
    如果当前记录的日期与今天的日期不一致，则改变

    在软件打开或者到了新的一天后调用。
    """
    global info
    if info == None:
        info = Infomation(fromLog=True)
    nowDate = Infomation(fromLog=False)
    if info.equal(nowDate):
        pass
    else:
        info.refresh(nowDate)

    global hasDayLoop
    if not hasDayLoop:
        info.refreshRestTime()
    hasDayLoop = True

def fiveMinLoop():
    """
    该循环5分钟循环一次，获取当前时间，如和
    """
    global info
    info.refreshRestTime()
    nowDate = time.localtime(time.time())
    if nowDate.tm_mday != info.day:
        dayLoop()
    info.writeToLog()

def oneMinLoop():
    """
    该循环每分钟循环一次，用于关机
    """
    global loopTime
    loopTime += 1
    if loopTime >= 5:
        fiveMinLoop()
        loopTime = 0

    global info
    if info.restTime <= 0:
        #写入记录
        fiveMinLoop()
        if info.restTime > 0:
            info.restTime -= 1;
            info.timeAppend(1)
            return
        #打开关机倒计时
        import webbrowser
        webbrowser.open("http://127.0.0.1:5768/CountDown.html")
        time.sleep(15)
        #关机
        import os
        if os.name.find('nt') >= 0:
            os.system("shutdown -s -t 0")
        else:
            os.system("shutdown now")
        return
    else:
        info.restTime -= 1;
    info.timeAppend(1)

def start():
    dayLoop()
    import webbrowser
    webbrowser.open("http://127.0.0.1:5768/index.html")
    while(True):
        time.sleep(60)
        oneMinLoop()

if __name__ == "__main__":
    start()
    pass
