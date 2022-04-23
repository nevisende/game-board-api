const mongoose = require('mongoose')

const playerSchema = mongoose.Schema({
  username: String,
  country: String,
  money: Number,
})