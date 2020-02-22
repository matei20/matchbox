const http = require("http");
const port = 7777;

const handleDownload = require("./handle-download");
const handleUpload = require("./handle-upload");
const handleDelete = require("./handle-delete");

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Request-Method", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    return res.end();
  }

  if (req.method === "GET") {
    return handleDownload(req, res);
  }

  if (!req.headers.authorization) {
    return res.end('{"message": "Unauthorized"}');
  }

  const base64 = req.headers.authorization.split(".")[1];
  const payload = Buffer.from(base64, "base64").toString();
  const id = JSON.parse(payload).ID;

  if (req.method === "POST") {
    return handleUpload(req, res, id);
  }

  if (req.method === "DELETE") {
    return handleDelete(req, res, id);
  }

  res.end("Hello from NodeJs");
});

server.listen(port, err => {
  if (err) return console.error(err);
  console.log(`server is listening on ${port}`);
});
