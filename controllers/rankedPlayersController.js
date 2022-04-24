const { resJsonLengthAndData, getAllPlayersFromRedis, createOnePlayerForRedisById } = require('../helpers')
const Player = require('../models/playersModel')
const indexPage = require('../index')

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
      const data = createOnePlayerForRedisById(player.id)
      indexPage.redisClient.set(`Player-${player.id}`, data)
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
    if (indexOfPlayer === -1) {
      res.status(404).json({ status: 'fail', message: 'No user found' })
    }
    const arrayIncludesOtherFourPlayers = allPlayers.slice(indexOfPlayer - 3, indexOfPlayer + 3)
    const data = { indexOfPlayer, player, arrayIncludesOtherFourPlayers }

    res.json({ status: 'success', data })
  } catch (err) {
    console.log(err)
    res.status(404).json({ status: 'fail' })
  }
}

async function updatePlayer(req, res) {
  try {
    const playerRedisId = `Player-${req.params.playerId}`
    const { playerId } = req.params
    const order = req.query

    const orderName = Object.keys(order)[0]
    const orderAmount = parseInt(order[orderName], 10)

    let playerOnRedis

    if (await indexPage.redisClient.get(playerRedisId)) {
      playerOnRedis = JSON.parse(await indexPage.redisClient.get(playerRedisId))
    } else {
      const data = createOnePlayerForRedisById(playerId)
      await indexPage.redisClient.set(`Player-${playerId}`, data)
    }

    const playerOnMongoDB = await Player.findById(playerId)
    let newData

    switch (orderName) {
      case 'increase_rank':
        newData = {
          ...playerOnRedis,
          rank: playerOnRedis.rank + orderAmount,
          todayRank: playerOnRedis.rank + orderAmount,
        }

        if (playerOnRedis.isThisWeekActive === false) {
          await Player.findByIdAndUpdate({ isThisWeekActive: true })
        }

        break;
      case 'decrease_rank':
        newData = {
          ...playerOnRedis,
          rank: playerOnRedis.rank - orderAmount,
          todayRank: playerOnRedis.rank - orderAmount,
        }

        if (playerOnRedis.isThisWeekActive === false) {
          await Player.findByIdAndUpdate(playerId, { isThisWeekActive: true })
        }
        break;
      case 'increase_money':
        await Player.findByIdAndUpdate(playerId, { money: playerOnMongoDB.money + orderAmount })
        break;
      case 'decrease_money':
        await Player.findByIdAndUpdate(playerId, { money: playerOnMongoDB.money - orderAmount })
        break;
      default:
        newData = playerOnRedis
    }

    indexPage.redisClient.set(playerRedisId, JSON.stringify(newData))
    res.send(Object.keys(order)[0])
  } catch (err) {
    console.log(err)
    res.status(404).json({ status: 'fail' })
  }
}

module.exports = {
  getHighHundredRanked,
  createRankedPlayersFindingDB,
  getDetailsOfOnePlayerById,
  updatePlayer,
}
