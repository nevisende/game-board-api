const randomWords = require('random-words');
const Player = require('../models/playersModel')
const indexPage = require('../index')
const { resJsonLengthAndData, insertMultiPlayers } = require('../helpers')

async function getPlayersByPageAndSize(req, res, next) {
  try {
    const { page = 1, size = 20 } = req.query

    const limit = parseInt(size, 10)
    const skip = (page - 1) * limit

    const players = await Player.find().limit(limit).skip(skip)
    const data = { page, limit, players }
    resJsonLengthAndData(res, data)
  } catch (err) {
    next(err)
  }
}

async function getOnePlayerById(req, res, next) {
  try {
    const { playerId } = req.params

    const player = await Player.findById(playerId)
    res.status(200).json({ status: 'success', data: player })
  } catch (err) {
    next(err)
  }
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
    console.error(err)
    res.status(400).json({ status: 'fail' })
  }
}

async function deleteAllPlayers(req, res) {
  await Player.deleteMany().then(() => {
    res.status(200).json({ status: 'success' })
  })

  await indexPage.redisClient.flushAll()
}

module.exports = {
  getPlayersByPageAndSize,
  createFakePlayers,
  deleteAllPlayers,
  getOnePlayerById,
}
