/* eslint-disable consistent-return */
/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint array-callback-return: 0 */

const mongoose = require('mongoose')
const indexPage = require('../index')
const Player = require('../models/playersModel')

function resJsonLengthAndData(res, doc) {
  res.status(200).json({
    status: 'success',
    results: doc.length,
    data: { doc },
  })
}

async function getAllPlayersFromRedis() {
  const keys = await indexPage.redisClient.keys('Player*')
  const players = [];

  for (let i = 0; i < keys.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const player = await indexPage.redisClient.get(keys[i])
    players.push(JSON.parse(player));
  }
  await Promise.all(players)
  return players
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

function createOnePlayerForRedisById(id) {
  const randomRanked = Math.floor(Math.random() * 100)
  const data = JSON.stringify({
    playerId: id,
    rank: randomRanked,
    todayRank: randomRanked,
    yesterdayRank: 0,
    isThisWeekActive: true,
  })
  return data
}

async function collectAllDetailsFromDbByRedisList(playersOnRedis) {
  const ids = []

  playersOnRedis.map((player) => {
    ids.push(mongoose.Types.ObjectId(player.playerId))
    return player
  })

  const result = Player.find({
    _id: {
      $in: ids,
    },
  })
    .then((playersOnDb) => {
      const collectedAllDetails = []

      playersOnDb.forEach((playerOnDb) => {
        const playerOnRedis = playersOnRedis
          .find((player) => player.playerId === playerOnDb.id)

        collectedAllDetails.push({
          playerId: playerOnRedis.playerId,
          rank: playerOnRedis.rank,
          rankDiff: playerOnRedis.todayRank - playerOnRedis.yesterdayRank,
          name: playerOnDb.username,
          country: playerOnDb.country,
          money: playerOnDb.money,
        })
      })
      return collectedAllDetails
    })
  return result
}

async function collectMoneyEarnedByAllPlayersInPrizePool(percent = 50) {
  try {
    const result = await Player
      .find({ earnedMoneyThisWeek: { $gt: 0 } }).exec(async (err, players) => {
        let total = 0
        for (let i = 0; i < players.length; i += 1) {
          const player = players[i]
          player.earnedMoneyThisWeek += Math.floor((player.earnedMoneyThisWeek * percent) / 100)
          total += player.earnedMoneyThisWeek
          player.save()
        }
        console.log(total)
        await indexPage.redisClient.set('PrizePool', total)
      })

    return result
  } catch (err) {
    console.log(err)
  }
}

async function givePrizesToTopHundredPlayers() {
  try {
    await getAllPlayersFromRedis()
      .then((players) => players.sort((a, b) => b.rank - a.rank).slice(0, 100))
      .then(async (sortedHundredPlayers) => {
        const firstRankPlayer = sortedHundredPlayers[0]
        const secondRankPlayer = sortedHundredPlayers[1]
        const thirdRankPlayer = sortedHundredPlayers[2]
        const firstPlayerPrizePercentage = 20
        const secondPlayerPrizePercentage = 15
        const thirdPlayerPrizePercentage = 10
        const prizeAmount = parseInt(await indexPage.redisClient.get('PrizePool'), 10)
        console.log({ prizeAmount: (await indexPage.redisClient.get('PrizePool')) })
        const ids = []

        sortedHundredPlayers.forEach((player) => {
          ids.push(mongoose.Types.ObjectId(player.playerId))
          return player
        })

        for (let i = 0; i < sortedHundredPlayers.length; i += 1) {
          const player = sortedHundredPlayers[i]
          const { playerId } = player
          let addMoney = 0
          switch (playerId) {
            case firstRankPlayer.playerId:
              addMoney = Math.floor((prizeAmount * firstPlayerPrizePercentage) / 100)
              console.log(addMoney)
              console.log(i)
              break;
            case secondRankPlayer.playerId:
              addMoney = Math.floor((prizeAmount * secondPlayerPrizePercentage) / 100)
              console.log(addMoney)
              console.log(i)
              break;
            case thirdRankPlayer.playerId:
              addMoney = Math.floor((prizeAmount * thirdPlayerPrizePercentage) / 100)
              console.log(addMoney)
              console.log(i)
              break;
            default:
              addMoney = Math.floor((prizeAmount * (
                100 - (
                  firstPlayerPrizePercentage
                  + secondPlayerPrizePercentage
                  + thirdPlayerPrizePercentage
                )
              )) / 100)
              console.log(addMoney)
              console.log(i)
          }
          if (!addMoney) addMoney = 0

          // eslint-disable-next-line no-await-in-loop
          await Player
            .findByIdAndUpdate(playerId, {
              $inc: { money: addMoney },
              isThisWeekActive: false,
              earnedMoneyThisWeek: 0,
            })
        }

        await indexPage.redisClient.set('PrizePool', 0)
      })
  } catch (err) {
    console.error(err)
  }
}

module.exports = {
  resJsonLengthAndData,
  getAllPlayersFromRedis,
  insertMultiPlayers,
  createOnePlayerForRedisById,
  collectAllDetailsFromDbByRedisList,
  collectMoneyEarnedByAllPlayersInPrizePool,
  givePrizesToTopHundredPlayers,
}
