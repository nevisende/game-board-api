const express = require('express')
const {
  getPlayersByPageAndSize,
  createFakePlayers,
  deleteAllPlayers,
  getOnePlayerById,
} = require('../controllers/playersController')

const router = express.Router()

router
  .route('/:playerId')
  .get(getOnePlayerById)

router
  .route('/')
  .get(getPlayersByPageAndSize)
  .post(createFakePlayers)
  .delete(deleteAllPlayers)

module.exports = router
