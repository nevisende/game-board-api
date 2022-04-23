const UserModel = require('../models/players')
const randomWords = require('random-words');

async function getAll(req, res) { 
  try {
    const users = await UserModel.find()
    res.status(200).json(users.length)
  } catch(err) {
    res.status(404).json({ message: err.message })
  }
}

async function createFakeUsers(req, res) {
  const userNumbers  = req.params.userNumbers
  const usersList = [];
  let randomString = ""
  for (let userIndex = 0; userIndex < userNumbers; userIndex++) {
   randomString = randomWords({ max:15, join: '', wordsPerString: 4});
    usersList.push({
      username: randomString,
      country: 'Turkey',
      money: Math.floor(Math.random() * userIndex)
    })
    if (userIndex % 10000 == 0) {
      await insertUsers(usersList)
      usersList = []
    }
  }

  await insertUsers(usersList)
} 

async function insertUsers (usersList) {
    await UserModel
      .insertMany(usersList)
      .then(() => {
        console.log(`${usersList.length} fake user${(userNumbers > 1) && "s"} created.`)
      })
      .catch((err) => {
        console.error(err)
      })
  }

module.exports = { getAll, createFakeUsers }