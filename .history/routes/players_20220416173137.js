const express = require('express');
const Users = new require('../controllers/players')
const router = express.Router()

router.get("/", Users.getAll())