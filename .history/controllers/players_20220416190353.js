const UserModel = require('../models/players')

async function getAll(req, res) { 
  try {
    const users = await UserModel.find()
    res.status(200).json(users)
  } catch(err) {
    res.status(404).json({ message: err.message })
  }
}

async function createFakeUsers(req, res) {
  for (let userIndex = 0; userIndex < req.params.userNumber; i++) {
    await UserModel.create()
  }
} 

module.exports = { getAll }