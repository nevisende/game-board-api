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
  const { userNumbers } = req.query
  const usersList = [];
  let randomString = ""
  for (let userIndex = 0; userIndex < userNumbers; i++) {
   randomString = crypto.randomBytes(20).toString();
    usersList.push({
      username: randomString,
      country: 'Turkey',
      money: Math.floor(Math.random() * userIndex)
    })
  }
  UserModel
    .insertMany(usersList)
    .then(() => {
      console.log(`${userNumbers} fake user${(userNumbers > 1) && "s"} created.`)
    })
    .catch(() => {
      conso
    })
} 

module.exports = { getAll }