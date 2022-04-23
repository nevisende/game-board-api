const express = require('express');
const { getHighHundredRanked, createFakePlayers, deleteAllPlayers } = require('../controllers/players')
const router = express.Router()

router
  .route('/')
  .get(getHighHundredRanked)
  .post(createFakePlayers)
  .delete(deleteAllPlayers)

module.exports = router