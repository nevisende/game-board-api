const randomWords = require('random-words');
const Player = require('../models/playersModel')
const index = require('../index')
const { resJsonLengthAndData } = require('../helpers')

async function getPlayers(req, res) {
  const { page = 1, size = 20 } = req.query

  const limit = parseInt(size, 10)
  const skip = (page - 1) * limit

  const players = await Player.find().limit(limit).skip(skip)

  resJsonLengthAndData(res, players)
}

async function insertMultiPlayers(playersList) {
  const playerNumbers = playersList.length
  await Player
    .insertMany(playersList)
    .then(() => {
      console.log(`${playerNumbers} fake user${(playerNumbers > 1) ? 's' : ''} created.`)
    })
    .catch((err) => {
      console.error(err)
    })
}

async function createFakePlayers(req, res) {
  const userNumbers = req.query.user_numbers || 150
  const isThisWeekActive = req.query.is_this_week_active || true
  let playersList = [];
  let randomString = ''

  try {
    for (let userIndex = 1; userIndex <= userNumbers; userIndex += 1) {
      randomString = randomWords({ min: 1, max: 15, join: '' });
      playersList.push({
        username: randomString,
        country: 'Turkey',
        money: Math.floor(Math.random() * userIndex * 1000),
        isThisWeekActive,
      })

      if (userIndex % 30 === 0) {
        insertMultiPlayers(playersList)
        playersList = []
      }
    }

    await insertMultiPlayers(playersList)
    res.status(200).json({ status: 'success' })
  } catch (err) {
    console.log(err)
    res.status(400).json({ status: 'fail' })
  }
}

async function deleteAllPlayers(req, res) {
  await Player.deleteMany().then(() => {
    res.status(200).json({ status: 'success' })
  })

  await index.redisClient.flushAll()
}

module.exports = { getPlayers, createFakePlayers, deleteAllPlayers }
