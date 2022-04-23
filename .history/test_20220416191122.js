var crypto = require("crypto");
var id = crypto.randomBytes(20).toString('utf8');

console.log(id)