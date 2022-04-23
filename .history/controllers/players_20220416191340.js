const UserModel = require('../models/players')
const crypto = require("crypto");
async function getAll(req, res) { 
  try {
    const users = await UserModel.find()
    res.status(200).json(users)
  } catch(err) {
    res.status(404).json({ message: err.message })
  }
}

async function createFakeUsers(req, res) {
  const usersList = [];
  randomId = ""
  for (let userIndex = 0; userIndex < req.params.userNumber; i++) {
   randomString = crypto.randomBytes(20).toString();
    usersList.push({
      
    })
  }
} 

module.exports = { getAll }