const express = require('express')
const { getHighHundredRanked } = require('../controllers/rankedPlayersController')

const router = express.Router()

router
  .route('/')
  .get(getHighHundredRanked)

module.exports = router
