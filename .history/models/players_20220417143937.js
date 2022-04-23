const mongoose = require('mongoose')

const playerSchema = mongoose.Schema({
  username: {
    type: String,
    require: [true, "A"]
    unique: true,
  }
  country: String,
  money: Number,
})

const Player = mongoose.model('Player', playerSchema)

module.exports = Player