const UserModel = require('../models/players')

class Users {
  async getAll(req,res) { 
    const users = UserModel.find()
    res.sen
  }
}