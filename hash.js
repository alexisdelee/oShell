var fs = require("fs");
var crypto = require("crypto");
var hash = crypto.createHash("sha256");

fs.readFile("oShell.exe", "utf-8", (err, data) => {
  if(err) return console.log(err);

  hash.update(data);
  console.log(hash.digest("hex"));
});