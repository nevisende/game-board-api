const express = require('express')
const { getPlayers, createFakePlayers, deleteAllPlayers } = require('../controllers/playersController')

const router = express.Router()

router
  .route('/')
  .get(getPlayers)
  .post(createFakePlayers)
  .delete(deleteAllPlayers)

module.exports = router
