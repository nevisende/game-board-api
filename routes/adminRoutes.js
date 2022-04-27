const express = require('express')
const {
  collectAndShareMoneys,
} = require('../controllers/adminController')

const router = express.Router()

router
  .route('/collect-and-share-moneys')
  .post(collectAndShareMoneys)

module.exports = router
