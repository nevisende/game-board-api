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

module.exports = { resJsonLengthAndData, getAllPlayersFromRedis, insertMultiPlayers }
