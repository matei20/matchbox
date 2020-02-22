var fs = require("fs");

function handleDelete(_req, res, id) {
  fs.unlink(`./uploads/${id}.jpg`, () => res.end('{ "success": true }'));
}

module.exports = handleDelete;
