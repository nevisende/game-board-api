const indexPage = require('../index')

function resJsonLengthAndData(res, doc) {
  res.status(200).json({
    status: 'success',
    results: doc.length,
    data: { doc },
  })
}

async function getTopHundredPlayerFromRedis() {
  const keys = await indexPage.redisClient.keys('Player*')
  const hundredPlayers = [];

  for (let i = 0; i < keys.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const player = await indexPage.redisClient.get(keys[i])
    hundredPlayers.push(JSON.parse(player));
  }

  return (await Promise.all(hundredPlayers)).sort((a, b) => b.rank - a.rank).slice(0, 100)
}
module.exports = { resJsonLengthAndData, getTopHundredPlayerFromRedis }
