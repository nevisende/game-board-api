const crypto = require("crypto");

var id = crypto.randomBytes(20).numBytes();
console.log(id)
