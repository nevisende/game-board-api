const randomWords = require('random-words');
const Player = require('../models/players')
const index = require('../index')
const { resJsonLengthAndData, getTopHundredPlayerFromRedis } = require('../helpers')

async function getHighHundredRanked(req, res) {
  try {
    if (await index.redisClient.dbSize() === 0) {
      await Player.find({ isThisWeekActive: true }).exec((err, players) => {
        players.forEach((player) => {
          const data = JSON.stringify({
            playerId: player.id,
            rank: Math.floor(Math.random() * players.length),
            today: 0,
            lastDay: 0,
          })
          index.redisClient.set(`Player-${player.id}`, data)
        })
      });
    }

    const hundredPlayers = await getTopHundredPlayerFromRedis()
    resJsonLengthAndData(res, hundredPlayers)
  } catch (err) {
    console.log(err)
    res.status(404).json({ status: 'fail' })
  }
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

module.exports = { getHighHundredRanked, createFakePlayers, deleteAllPlayers }
