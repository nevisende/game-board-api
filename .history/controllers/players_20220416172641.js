const UserModel = require('../models/players')

class Users {
  async getAll(req, res) { 
    try 
    const users = UserModel.find()
    res.status(200).json(users)
  }
}