const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

const PORT = process.env.PORT || 4400
const DB_CONNECTION_URL = process.env.DB_CONNECTION_URL || 
mongoose.connect(DB_CONNECTION_URL)