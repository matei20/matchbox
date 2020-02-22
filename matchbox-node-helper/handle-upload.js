var fs = require("fs");
var multiparty = require("multiparty");

function handleUpload(req, res, id) {
  const file = fs.createWriteStream(`./uploads/${id}.jpg`);

  var form = new multiparty.Form();
  form.on("part", function(part) {
    if (part.filename) {
      part.pipe(file);
    } else part.resume();
  });

  form.on("close", () => res.end('{"success": true}'));
  form.parse(req);
}

module.exports = handleUpload;
