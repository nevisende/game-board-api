const express = require('express');
const { getAll, createFakePlayers } = require('../controllers/players')
const router = express.Router()

router.get("/", getAll).post

router.get("/create/:userNumbers", createFakePlayers)

module.exports = router