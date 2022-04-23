function resJsonLengthAndData(res, doc) {
  res.status(200).json({
    status: 'success',
    results: doc.length,
    data: { doc }
  })
}
module.exports = { resJsonLengthAndData }

try {
    console.log(await index.redisClient.dbSize())
    let hundredPlayers;
    if (await index.redisClient.dbSize() > 0) {
      hundredPlayers = []
      const players = await index.redisClient.get("players")
      console.log(players)
      hundredPlayers.push(players)
      helpers.resJsonLengthAndData(res, hundredPlayers)
    } else {
      await Player.find({ isThisWeekActive: true }).exec((err, players) => {
        players.forEach(player => {
          index.redisClient.set("players", {
            playerId: player.id,
            rank: 0,
            today: 0,
            lastDay: 0
          })
        })
        hundredPlayers = players.slice(0, 100)
        helpers.resJsonLengthAndData(res, hundredPlayers)
      });
    }
    
  } catch (err) {
    console.log(err)
    res.status(404).json({ status: 'fail' })
  }