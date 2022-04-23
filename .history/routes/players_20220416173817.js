const express = require('express');
const { getAll } = require('../controllers/players')
const router = express.Router()

router.get("/", getAll)

module.exports = router