from  http.server import HTTPServer,BaseHTTPRequestHandler
from urllib.parse import urlparse
from threading import Thread
import Main

class  MServer(BaseHTTPRequestHandler):
    types = {".html": "text/html", '.png': 'image/png', '.jpg':'image/jpeg', ".log": "text/plain"
             ,".css": "text/css", ".js": "text/javascript"}
    #get
    def do_GET(self):
        path = urlparse(self.path)
        types = self.types
        contentType = types['.log']
        if path.path.find(".") < 0:
            self.handleQuery(path)
            return
        for each in types:
            if path.path.endswith(each):
                contentType = types[each]
                break

        content = None
        try:
            with open("." + path.path, "rb") as file:
                content = file.read()
            self.send_response(200)
        except:
            self.send_error(404, "File not Exists")
            return
        self.send_header('Content-type', contentType)
        self.end_headers()
        self.wfile.write(content)
        self.wfile.close()

    def handleQuery(self, path):
        tmp = path.query
        tmp = tmp.split("&")
        query = {}
        for each in tmp:
            each = each.split("=")
            query[each[0]] = each[1]

        content = bytes(getattr(QueryHandler, query['m'])(query), 'utf-8')

        self.send_response(200)
        self.send_header("Content-type", self.types[".log"])
        self.end_headers()
        self.wfile.write(content)
        self.wfile.close()

class QueryHandler:
    @staticmethod
    def setRestTime(query):
        Main.info.restTime = int(query['restTime'])
        return 'ok'

    @staticmethod
    def setAutoExitTime(query):
        Main.info.autoExitTime = int(query['autoExitTime'])
        return 'ok'

    @staticmethod
    def getRestTime(query):
        return str(Main.info.restTime)

    @staticmethod
    def setCloseTime(query):
        Main.info.closeTimeHour = int(query['hour'])
        Main.info.closeTimeMinute = int(query['minute'])
        return 'ok'

    @staticmethod
    def getLog(query):
        tmp = ""
        contents = ('totleUse', 'yearUse', 'dayUse', 'monthUse', 'autoExitTime')
        for each in contents:
            tmp += each + ' = ' + str(getattr(Main.info, each)) + '\n'

        tmp += 'closeTime = ' + str(Main.info.closeTimeHour * 60 + Main.info.closeTimeMinute) + '\n'

        return tmp


if __name__ == "__main__":
    loopthread = Thread(target=Main.start)
    loopthread.start()
    port = 5768
    server_address = ('', port)
    httpd = HTTPServer(server_address, MServer)
    httpd.serve_forever()