const express = require('express');
const UsersController = require('../controllers/players')
const router = express.Router()

const Users = new UsersController()
router.get("/", Users.getAll())