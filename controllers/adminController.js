/* eslint array-callback-return: 0 */
/* eslint no-param-reassign: ["error", { "props": false }] */
const { collectMoneyEarnedByAllPlayersInPrizePool, givePrizesToTopHundredPlayers } = require('../helpers')
// const Player = require('../models/playersModel')

async function collectAndShareMoneys(req, res, next) {
  try {
    const { percent = 2 } = req.query
    await collectMoneyEarnedByAllPlayersInPrizePool(percent)
      .then(async () => {
        await givePrizesToTopHundredPlayers()
        res.status(200).json({ status: 'success' })
      }).catch((err) => next(err))
  } catch (err) {
    next(err)
  }
}

module.exports = { collectAndShareMoneys }
