const randomWords = require('random-words');
const Player = require('../models/playersModel')
const index = require('../index')
const { resJsonLengthAndData, insertMultiPlayers } = require('../helpers')

async function getPlayersByPageAndSize(req, res) {
  const { page = 1, size = 20 } = req.query

  const limit = parseInt(size, 10)
  const skip = (page - 1) * limit

  const players = await Player.find().limit(limit).skip(skip)
  const data = { page, limit, players }
  resJsonLengthAndData(res, data)
}

async function getOnePlayerById(req, res) {
  const { playerId } = req.params

  const player = await Player.findById(playerId)
  res.status(200).json({ status: 'success', data: player })
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

module.exports = {
  getPlayersByPageAndSize,
  createFakePlayers,
  deleteAllPlayers,
  getOnePlayerById,
}
