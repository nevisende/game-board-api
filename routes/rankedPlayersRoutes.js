const express = require('express')
const {
  getHighHundredRanked, createRankedPlayersFindingDB, getDetailsOfOnePlayerById, updatePlayer,
} = require('../controllers/rankedPlayersController')

const router = express.Router()

router
  .route('/:playerId')
  .get(getDetailsOfOnePlayerById)
  .put(updatePlayer)

router
  .route('/')
  .get(getHighHundredRanked)
  .post(createRankedPlayersFindingDB)

module.exports = router
