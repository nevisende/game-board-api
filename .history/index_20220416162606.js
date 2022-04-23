const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

const PORT = process.env.PORT || 4400
const DB_CONNECTION_URL = "mongodb+srv://nevisende:Frkn2344@cluster1.u6rxm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

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
  catch ((err) => {
    console.error(err)
  })
