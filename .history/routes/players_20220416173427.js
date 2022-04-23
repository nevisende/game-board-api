const express = require('express');
const Users = require('../controllers/players')
const router = express.Router()

const User = new Users()
router.get("/", User.getAll)