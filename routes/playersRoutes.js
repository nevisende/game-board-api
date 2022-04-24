const express = require('express')
const { getPlayersByPageAndSize, createFakePlayers, deleteAllPlayers } = require('../controllers/playersController')

const router = express.Router()

router
  .route('/')
  .get(getPlayersByPageAndSize)
  .post(createFakePlayers)
  .delete(deleteAllPlayers)

module.exports = router
