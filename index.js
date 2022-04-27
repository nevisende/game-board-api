const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const redis = require('redis')
const cron = require('cron')

const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
  REDIS_URL,
  REDIS_PORT,
} = require('./config/config');

const playerRoutes = require('./routes/playersRoutes')
const rankedPlayersRoutes = require('./routes/rankedPlayersRoutes')
const leaderBoardRoutes = require('./routes/leaderBoardRoutes')
const adminRoutes = require('./routes/adminRoutes')
const { collectMoneyEarnedByAllPlayersInPrizePool, givePrizesToTopHundredPlayers } = require('./helpers')

// Cron configs: run every monday at 1am
const mondayAtOneAm = '0 0 0 * * 1'
const cronTimeForWeeklyPrize = new cron.CronJob(mondayAtOneAm, async () => {
  try {
    const percent = 2
    await collectMoneyEarnedByAllPlayersInPrizePool(percent)
      .then(async () => {
        await givePrizesToTopHundredPlayers()
      }).catch((err) => console.error(err))
  } catch (err) {
    console.error(err)
  }
})
cronTimeForWeeklyPrize.start()

// MongoDB configs:
const DB_CONNECTION_URL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectDbWithRetry = () => {
  mongoose
    .connect(DB_CONNECTION_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('successfully connected to DB'))
    .catch((e) => {
      console.log(e);
      setTimeout(connectDbWithRetry, 5000);
    });
};

connectDbWithRetry();

// Redis configs:
const redisClient = redis.createClient({ url: `redis://${REDIS_URL}:${REDIS_PORT}` });

redisClient.on('connect', () => {
  console.log('successfully connected to redis');
});

redisClient.on('error', (err) => {
  console.error(`fail connection of redis${err}`);
});

redisClient.connect();

// Express configs:
const app = express()

app.enable('trust proxy')
app.use(bodyParser.json({ limit: '50mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(cors())

app.get('/api/v1', (req, res) => {
  res.json({
    status: 'success',
    data: {
      author: 'Furkan Denizhan',
      message: 'Welcome to my game board server :)',
    },
  })
})

app.use('/api/v1/players', playerRoutes)
app.use('/api/v1/ranked-players', rankedPlayersRoutes)
app.use('/api/v1/leader-board', leaderBoardRoutes)
app.use('/api/v1/admin', adminRoutes)

const PORT = process.env.PORT || 4400

app.listen(PORT, () => { console.log(`Game board server is listening on ${PORT}`) })
exports.redisClient = redisClient
