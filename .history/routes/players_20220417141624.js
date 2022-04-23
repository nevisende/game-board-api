const express = require('express');
const { getHighHundredRanked, createFakePlayers } = require('../controllers/players')
const router = express.Router()

router
  .route('/')
  .get(getHighHundredRanked)
  .post(createFakePlayers)

module.exports = router