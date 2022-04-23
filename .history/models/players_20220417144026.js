const mongoose = require('mongoose')

const playerSchema = mongoose.Schema({
  username: {
    type: String,
    require: [true, "Players must have a username"],
    unique: true,
  },
  country: {
    type: String,
    require: [true, "Players must have a country"]
  },
  money: Number,
})

const Player = mongoose.model('Player', playerSchema)

module.exports = Player