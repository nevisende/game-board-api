const express = require('express')
const {
  getAllDetailsOfPlayers,
  getAllDetailsOfPlayerById,
} = require('../controllers/leaderBoardController')

const router = express.Router()

router
  .route('/:playerId')
  .get(getAllDetailsOfPlayerById)

router
  .route('/')
  .get(getAllDetailsOfPlayers)

module.exports = router
