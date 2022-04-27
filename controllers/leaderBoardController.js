const { getAllPlayersFromRedis, collectAllDetailsFromDbByRedisList } = require('../helpers')

async function getAllDetailsOfPlayers(req, res, next) {
  try {
    await getAllPlayersFromRedis()
      .then(
        (players) => players
          .sort((a, b) => b.rank - a.rank)
          .slice(0, 100),
      ).then(async (redisList) => {
        await collectAllDetailsFromDbByRedisList(redisList).then((collectedAllDetails) => {
          collectedAllDetails.sort((a, b) => b.rank - a.rank)
          res.status(200).json({ status: 'success', data: collectedAllDetails })
        })
      })
  } catch (err) {
    next(err)
  }
}

async function getAllDetailsOfPlayerById(req, res, next) {
  try {
    const allPlayers = await getAllPlayersFromRedis()
      .then((players) => players.sort((a, b) => b.rank - a.rank))

    const player = allPlayers.find((i) => i.playerId === req.params.playerId)
    const indexOfPlayer = allPlayers.indexOf(player)

    if (indexOfPlayer === -1) {
      res.status(404).json({ status: 'fail', message: 'No user found' })
    }

    const arrayIncludesOtherFivePlayers = allPlayers.slice(indexOfPlayer - 3, indexOfPlayer + 3)

    await collectAllDetailsFromDbByRedisList([player])
      .then(async (collectedPlayerDetails) => {
        await collectAllDetailsFromDbByRedisList(arrayIncludesOtherFivePlayers)
          .then((collectedFivePlayersDetails) => {
            const data = { indexOfPlayer, collectedPlayerDetails, collectedFivePlayersDetails }
            res.json({ status: 'success', data })
          })
      })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getAllDetailsOfPlayers,
  getAllDetailsOfPlayerById,
}
