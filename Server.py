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

        if path.path == "/stat":
            content = str.encode(str(Main.startTime))
            self.send_response(200)
            self.send_header('Content-type', contentType)
            self.end_headers()
            self.wfile.write(content)
            self.wfile.close()
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


if __name__ == "__main__":
    loopthread = Thread(target=Main.start)
    loopthread.start()
    port = 5768
    server_address = ('', port)
    httpd = HTTPServer(server_address, MServer)
    httpd.serve_forever()