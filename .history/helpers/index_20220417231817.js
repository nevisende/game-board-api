const index = require('../index')


function resJsonLengthAndData(res, doc) {
  res.status(200).json({
    status: 'success',
    results: doc.length,
    data: { doc }
  })
}

async function getTopHundredPlayerFromRedis() {
  const keys = await index.redisClient.keys("Player*")
  const hundredPlayers = [];

  for (let i = 0; i < keys.length; i++) {
    const player = await index.redisClient.get(keys[i])
    hundredPlayers.push(JSON.parse(player));
  }
      
  hundredPlayers.sort((a, b) => b.rank - a.rank).slice(0, 100)
  return hundredPlayers
}
module.exports = { resJsonLengthAndData, getTopHundredPlayerFromRedis }

