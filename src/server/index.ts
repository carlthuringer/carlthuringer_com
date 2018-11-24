import http from "http";
import { readFile } from "fs";
import { extname, join } from "path";

type MIME_TYPE_MAP = { [index: string]: string };
const MIME_TYPE_MAP: MIME_TYPE_MAP = {
  ".html": "text/html",
  ".png": "image/png"
};

class Server {
  serverRoot: string;

  constructor(root: string) {
    this.serverRoot = root;
  }

  respondToError = (err: NodeJS.ErrnoException, res: http.ServerResponse) => {
    this.log("ERR", err.toString());
    if (err.code == "ENOENT") {
      res.writeHead(404);
    } else {
      res.writeHead(500);
    }
  };

  log = (progName: string, message: string) => {
    console.log(`[${process.hrtime()[0]}][${progName}] - ${message}`);
  };

  start = () => {
    const server = http.createServer();

    server.on(
      "request",
      (req: http.IncomingMessage, res: http.ServerResponse) => {
        const reqPath = req.url;

        let fullPath: string;
        if (typeof reqPath == "undefined" || reqPath == "/") {
          fullPath = join(this.serverRoot, "index.html");
        } else {
          if (extname(reqPath) == "") {
            fullPath = join(this.serverRoot, reqPath + ".html");
          } else {
            fullPath = join(this.serverRoot, reqPath);
          }
        }

        let mimeType = MIME_TYPE_MAP[extname(fullPath)];
        if (!mimeType) {
          mimeType = "application/octet-stream";
          this.log("PRS", `Unknown Mime Type for ${fullPath}`);
        }

        this.log("SRV", `${req.method} - ${fullPath}`);
        readFile(fullPath, (err, data) => {
          if (err) {
            this.respondToError(err, res);
          } else {
            res.setHeader("Content-Type", mimeType);
            res.write(data);
          }
          res.end();
        });
      }
    );

    server.listen(8080);
  };
}

export default (serverRoot: string) => new Server(serverRoot).start();
