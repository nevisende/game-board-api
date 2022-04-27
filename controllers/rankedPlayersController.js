const { resJsonLengthAndData, getAllPlayersFromRedis, createOnePlayerForRedisById: createOnePlayerObjForRedisById } = require('../helpers')
const Player = require('../models/playersModel')
const indexPage = require('../index')

async function getHighHundredRanked(req, res) {
  try {
    if (await (await indexPage.redisClient.keys('*')).length === 0) {
      resJsonLengthAndData(res, [])
    } else {
      const hundredPlayers = await getAllPlayersFromRedis()
        .then((players) => players.sort((a, b) => b.rank - a.rank).slice(0, 100))
      resJsonLengthAndData(res, hundredPlayers)
    }
  } catch (err) {
    console.error(err)
    res.status(404).json({ status: 'fail' })
  }
}

async function createRankedPlayersFindingDB(req, res, next) {
  try {
    await Player.find().exec((err, players) => {
      players.forEach((player) => {
        const data = createOnePlayerObjForRedisById(player.id)
        indexPage.redisClient.set(`Player-${player.id}`, data)
      })
    });

    res.status(200).json({ status: 'success' })
  } catch (err) {
    next(err)
  }
}

async function getDetailsOfOnePlayerById(req, res, next) {
  try {
    const allPlayers = await getAllPlayersFromRedis()
      .then((players) => players.sort((a, b) => b.rank - a.rank))

    const player = allPlayers.find((i) => i.playerId === req.params.playerId)
    const indexOfPlayer = allPlayers.indexOf(player)
    if (indexOfPlayer === -1) {
      res.status(404).json({ status: 'fail', message: 'No user found' })
    }
    const arrayIncludesOtherFivePlayers = allPlayers.slice(indexOfPlayer - 3, indexOfPlayer + 3)
    const data = { indexOfPlayer, player, arrayIncludesOtherFivePlayers }

    res.json({ status: 'success', data })
  } catch (err) {
    next(err)
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
      const data = createOnePlayerObjForRedisById(playerId)
      await indexPage.redisClient.set(playerRedisId, data)
      playerOnRedis = data
    }

    const playerOnMongoDB = await Player.findById(playerId)
    let newData = playerOnRedis

    switch (orderName) {
      case 'increase_rank':
        newData = {
          ...playerOnRedis,
          rank: playerOnRedis.rank + orderAmount,
          todayRank: playerOnRedis.rank + orderAmount,
        }

        if (playerOnRedis.isThisWeekActive === false) {
          await Player.findByIdAndUpdate(playerId, { isThisWeekActive: true })
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
        await Player.findByIdAndUpdate(playerId, {
          money: playerOnMongoDB.money + orderAmount,
          earnedMoneyThisWeek: playerOnMongoDB.earnedMoneyThisWeek + orderAmount,
        })
        break;
      case 'decrease_money':
        await Player.findByIdAndUpdate(playerId, {
          money: playerOnMongoDB.money - orderAmount,
          earnedMoneyThisWeek: playerOnMongoDB.earnedMoneyThisWeek - orderAmount,
        })
        break;
      default:
        newData = playerOnRedis
    }

    await indexPage.redisClient.set(playerRedisId, JSON.stringify(newData))
    res.status(200).json({ status: 'success' })
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
