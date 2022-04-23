const express = require('express');
const Users = require('../controllers/players')
const router = express.Router()

router.get("/", Users.getAll())