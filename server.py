import os
import sys
import time
import threading
import http.server
import socketserver

LATEST_MTIME = time.time()

def monitor_mtime():
    global LATEST_MTIME
    while True:
        try:
            max_m = 0
            for root, dirs, files in os.walk('.'):
                if '.git' in root or '__pycache__' in root or '.gemini' in root:
                    continue
                for f in files:
                    if f.endswith(('.js', '.css', '.html', '.png', '.jpg', '.jpeg')):
                        filepath = os.path.join(root, f)
                        try:
                            m = os.path.getmtime(filepath)
                            if m > max_m:
                                max_m = m
                        except Exception:
                            pass
            if max_m > 0:
                LATEST_MTIME = max_m
        except Exception:
            pass
        time.sleep(0.5)

class LiveReloadHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/api/live-reload-check':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
            self.end_headers()
            self.wfile.write(f'{{"mtime": {LATEST_MTIME}}}'.encode('utf-8'))
            return
        super().do_GET()

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

class ThreadingTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    daemon_threads = True
    allow_reuse_address = True

if __name__ == '__main__':
    PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    t = threading.Thread(target=monitor_mtime, daemon=True)
    t.start()
    with ThreadingTCPServer(("", PORT), LiveReloadHTTPRequestHandler) as httpd:
        print(f"Serving HTTP on port {PORT} with Live-Reload Threading Server...")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass
