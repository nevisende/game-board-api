const express = require('express')
const { getHighHundredRanked, createRankedPlayersFindingDB, getDetailsOfOnePlayerById } = require('../controllers/rankedPlayersController')

const router = express.Router()

router
  .route('/:playerId')
  .get(getDetailsOfOnePlayerById)

router
  .route('/')
  .get(getHighHundredRanked)
  .post(createRankedPlayersFindingDB)

module.exports = router
