var crypto = require("crypto");
var id = crypto.randomBytes(20).toString();

console.log(id)