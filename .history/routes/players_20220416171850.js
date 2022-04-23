const express = require('express');
const Users = require('../controllers')
const router = express.Router()

router.get("/", Users.getAll())