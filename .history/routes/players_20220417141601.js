const express = require('express');
const { getAll, createFakePlayers } = require('../controllers/players')
const router = express.Router()

router
  .route('/')
  .get(getFirstHundredRanked)
  .post(createFakePlayers)

module.exports = router