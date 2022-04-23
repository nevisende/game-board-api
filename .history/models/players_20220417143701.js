const mongoose = require('mongoose')

const playerSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true
  }
  country: String,
  money: Number,
})

const Player = mongoose.model('Player', playerSchema)

module.exports = Player