const express = require('express');
const Users = require('../controllers/players')
const router = express.Router()

const User = new UsersController()
router.get("/", User.getAll)