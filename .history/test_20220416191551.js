const crypto = require("crypto");

var id = crypto.randomBytes(20).toNumber();
console.log(id)
