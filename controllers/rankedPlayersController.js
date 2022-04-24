const { resJsonLengthAndData, getAllPlayersFromRedis } = require('../helpers')
const index = require('../index')
const Player = require('../models/playersModel')

async function getHighHundredRanked(req, res) {
  try {
    const hundredPlayers = await getAllPlayersFromRedis()
      .then((players) => players.sort((a, b) => b.rank - a.rank).slice(0, 100))
    resJsonLengthAndData(res, hundredPlayers)
  } catch (err) {
    console.log(err)
    res.status(404).json({ status: 'fail' })
  }
}

async function createRankedPlayersFindingDB(req, res) {
  await Player.find().exec((err, players) => {
    players.forEach((player) => {
      const randomRanked = Math.floor(Math.random() * players.length)
      const data = JSON.stringify({
        playerId: player.id,
        rank: randomRanked,
        todayRank: randomRanked,
        yesterdayRank: 0,
        isThisWeekActive: true,
      })
      index.redisClient.set(`Player-${player.id}`, data)
    })
  });

  res.status(200).json({ status: 'success' })
}
async function getDetailsOfOnePlayerById(req, res) {
  try {
    const allPlayers = await getAllPlayersFromRedis()
      .then((players) => players.sort((a, b) => b.rank - a.rank))
    const player = allPlayers.find((i) => i.playerId === req.params.playerId)
    const indexOfPlayer = allPlayers.indexOf(player)

    const arrayIncludesOtherFourPlayers = allPlayers.slice(indexOfPlayer - 3, indexOfPlayer + 3)
    const data = { indexOfPlayer, player, arrayIncludesOtherFourPlayers }
    res.json({ status: 'success', data })
  } catch (err) {
    console.log(err)
    res.status(404).json({ status: 'fail' })
  }
}
module.exports = { getHighHundredRanked, createRankedPlayersFindingDB, getDetailsOfOnePlayerById }
