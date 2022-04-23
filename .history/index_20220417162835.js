const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const playerRoutes = require('./routes/players')
const { MO}

const app = express()

dotenv.config()
app.use(bodyParser.json({ limit: '50mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(cors())

app.get("/", (req, res) => {
  res.json({
    author: "Furkan Denizhan",
    message: "The index route of Game board server "
  })
})

app.use("/players", playerRoutes)

const PORT = process.env.PORT || 4400
const DB_CONNECTION_URL = process.env.DB_CONNECTION_URL

mongoose
  .connect(DB_CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Game board server is listening on ${PORT}`)
    })
  })
  .catch ((err) => {
    console.error(err)
  })
