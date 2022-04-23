const Player = require('../models/players')
const randomWords = require('random-words');
const res = require('express/lib/response');

async function getHighHundredRanked(req, res) { 
  try {
    res.locals.msg = []
    const hundredPlayers = await Player.find().limit(100);
    res.status(200).json({ 
      status: 'success', 
      results: hundredPlayers.length, 
      data: { hundredPlayers }
    })
  } catch(err) {
    res.status(404).json({ message: err.message })
  }
}

async function createFakePlayers(req, res) {
  const userNumbers  = req.body.user_numbers
  let playersList = [];
  let randomString = ""
  for (let userIndex = 1; userIndex <= userNumbers; userIndex++) {
   randomString = randomWords({ max:15, join: '', wordsPerString: 4});
    playersList.push({
      username: randomString,
      country: 'Turkey',
      money: Math.floor(Math.random() * userIndex)
    })
    if (userIndex % 10000 == 0) {
      await insertPlayers(playersList)
      playersList = []
    }
  }

  await insertPlayers(playersList)
} 

async function insertPlayers(playersList) {
  const playerNumbers = playersList.length
    await Player
      .insertMany(playersList)
      .then(() => {
        console.log(`${playerNumbers} fake user${(playerNumbers > 1) ? "s" : ''} created.`)
      })
      .catch((err) => {
        console.error(err)
      })
}

async function deleteAllPlayers(req, res) {
  await Player.deleteMany().then(() => {
    res.status(200).json({ status: 'success'})
  })
}

module.exports = { getHighHundredRanked, createFakePlayers, deleteAllPlayers }