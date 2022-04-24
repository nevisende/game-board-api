const { resJsonLengthAndData, getTopHundredPlayerFromRedis } = require('../helpers')
const index = require('../index')
const Player = require('../models/playersModel')

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

module.exports = { getHighHundredRanked }
