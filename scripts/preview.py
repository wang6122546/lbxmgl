#!/usr/bin/env python3
"""从项目实际目录启动本地预览；增加并发队列以支持 ES 模块加载。"""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import argparse

class PreviewServer(ThreadingHTTPServer):
    request_queue_size = 128
    daemon_threads = True

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--port', type=int, default=8770)
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1]
    handler = partial(SimpleHTTPRequestHandler, directory=str(root))
    with PreviewServer(('127.0.0.1', args.port), handler) as server:
        print(f'Preview: http://127.0.0.1:{args.port}/pages/projects.html', flush=True)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass
