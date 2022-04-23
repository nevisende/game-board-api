const express = require('express');
const { getAll, createFakeUsers } = require('../controllers/players')
const router = express.Router()

router.get("/", getAll)

router.post("/create/:userNumbers", createFakeUsers)

module.exports = router