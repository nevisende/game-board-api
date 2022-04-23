const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const redis = require("redis");

const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
  REDIS_URL,
  REDIS_PORT,
} = require("./config/config");

const playerRoutes = require('./routes/players')

const DB_CONNECTION_URL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectDbWithRetry = () => {
  mongoose
    .connect(DB_CONNECTION_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("successfully connected to DB"))
    .catch((e) => {
      console.log(e);
      setTimeout(connectDbWithRetry, 5000);
    });
};

connectDbWithRetry();

const redisClient = redis.createClient({ url: `redis://${REDIS_URL}:${REDIS_PORT}`});

redisClient.on("connect", function () {
  console.log("successfully connected to redis");
});


redisClient.on("error", function (err) {
  console.error("fail connection of redis" + err);
});

redisClient.connect();

const app = express()

app.enable("trust proxy")
app.use(bodyParser.json({ limit: '50mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(cors())

app.get("/api/v1", (req, res) => {
  res.json({ 
    status: 'success',   
    data: { 
      author: "Furkan Denizhan",
      message: "Welcome to my game board server :)"   
    },
  })
})

app.use("/api/v1/players", playerRoutes)

const PORT = process.env.PORT || 4400

mongoose
  .connect(DB_CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    
  })
  .catch ((err) => {
    console.error(err)
  })

app.listen(PORT, () => { console.log(`Game board server is listening on ${PORT}`) })
exports.redisClient = redisClient;