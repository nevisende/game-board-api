function resJsonLengthAndData(res, doc) {
  res.status(200).json({
    status: 'success',
    results: doc.length,
    data: { doc }
  })
}

function getTopHundredPlayerFromRedis(arr) {
  let hundredPlayers = arr;
  for (var i = 0; i < keys.length; i++) {
    const player = await index.redisClient.get(keys[i])
    hundredPlayers.push(JSON.parse(player));
  }
      
  hundredPlayers.sort((a, b) => b.rank - a.rank).slice(0,100)
}
module.exports = { resJsonLengthAndData, getTopHundredPlayerFromRedis }

