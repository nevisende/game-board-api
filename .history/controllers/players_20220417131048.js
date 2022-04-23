const UserModel = require('../models/players')
const randomWords = require('random-words');

async function getAll(req, res) { 
  try {
    const users = await UserModel.find()
    res.status(200).json(users)
  } catch(err) {
    res.status(404).json({ message: err.message })
  }
}

async function createFakeUsers(req, res) {
  const userNumbers  = req.params.userNumbers
  const usersList = [];
  let randomString = ""
  for (let userIndex = 0; userIndex < userNumbers; userIndex++) {
   randomString = randomWords({ max:15, join: '', wordsPers});
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
    .catch((err) => {
      console.error(err)
    })
} 

module.exports = { getAll, createFakeUsers }