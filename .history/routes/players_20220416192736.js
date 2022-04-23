const express = require('express');
const { getAll } = require('../controllers/players')
const router = express.Router()

router.get("/", getAll)

router.post("/create", createFakeUsers)

module.exports = router