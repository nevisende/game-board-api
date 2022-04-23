const express = require('express');
const Users = require('../controllers/players')
const router = express.Router()

const Users = new UsersController()
router.get("/", Users.getAll)