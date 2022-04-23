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
  const users
  const usersList = [];
  let randomString = ""
  for (let userIndex = 0; userIndex < req.params.userNumber; i++) {
   randomString = crypto.randomBytes(20).toString();
    usersList.push({
      username: randomString,
      country: 'Turkey',
      money: Math.floor(Math.random() * userIndex)
    })
  }
  UserModel
    .insertMany(usersList)
    .then(function () {
      console.log(randomString)
    })
} 

module.exports = { getAll }