const express = require('express');
const { getAll } = require('../controllers/players')
const router = express.Router()

const User = new Users()
router.get("/", User.getAll)