const express = require('express');
const { getAll, createFakePlayers } = require('../controllers/players')
const router = express.Router()

router
  .route('/')
  .get(getAll)
  .post(createFakePlayers)

router.get("/create/:userNumbers", createFakePlayers)

module.exports = router