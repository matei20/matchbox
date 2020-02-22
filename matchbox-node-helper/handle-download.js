var fs = require("fs");
var url = require("url");

const defaultPath = "./uploads/default.jpg";

function handleDownload(req, res) {
  const { pathname } = url.parse(req.url);
  const path = pathname === "/" ? defaultPath : `./uploads${pathname}`;

  fs.access(path, fs.F_OK, err => {
    const file = fs.createReadStream(err ? defaultPath : path);
    file.pipe(res);
  });
}

module.exports = handleDownload;
