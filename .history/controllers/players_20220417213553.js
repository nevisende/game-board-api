const Player = require('../models/players')
const randomWords = require('random-words');
const index = require('../index')
const helpers = require('../helpers')


async function getHighHundredRanked(req, res) { 
  try {
    console.log(await index.redisClient.dbSize())
    let hundredPlayers;
    console.log(await index.redisClient.get("*"))
    if (await index.redisClient.dbSize() > 1000) {
      hundredPlayers = await index.redisClient.get("*")
      helpers.resJsonLengthAndData(res, hundredPlayers)
    } else {
      await Player.find({ isThisWeekActive: true }).exec((err, players) => {
        players.forEach(player => {
          index.redisClient.set(player.id, player)
        })
        hundredPlayers = players.slice(0, 100)
        helpers.resJsonLengthAndData(res, hundredPlayers)
      });
    }
    
  } catch (err) {
    console.log(err)
    res.status(404).json({ status: 'fail' })
  }
}

async function createFakePlayers(req, res) {
  const userNumbers = req.body.user_numbers
  const isThisWeekActive = req.body.is_this_week_active || false
  let playersList = [];
  let randomString = ""
  
  try {
    for (let userIndex = 1; userIndex <= userNumbers; userIndex++) {
      randomString = randomWords({ min: 1, max:15, join: ''});
      playersList.push({
        username: randomString,
        country: "Turkey",
        money: Math.floor(Math.random() * userIndex * 1000),
        isThisWeekActive
      })
      
      if (userIndex % 30 == 0) {
        await insertMultiPlayers(playersList)
        playersList = []
      }
    }

    await insertMultiPlayers(playersList)
    res.status(200).json({ status: "success" })
  } catch (err) {
    console.log(err)
    res.status(400).json( { status: "fail"})
  }
  
  
} 

async function insertMultiPlayers(playersList, res) {
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