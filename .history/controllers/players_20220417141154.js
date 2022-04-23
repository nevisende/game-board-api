const Player = require('../models/players')
const randomWords = require('random-words');

async function getAll(req, res) { 
  try {
    res.locals.msg = []
    const cursor = await Player.find({}).lean().cursor();
    const cursorL = await Player.count()
    cursor.on('data', function (player) {
      res.locals.msg.push(player);
    });
    cursor.on('end', function () {
      console.log('All players are loaded here');
      res.status(200).send(res.locals.msg.join('\n'))
    });
  } catch(err) {
    res.status(404).json({ message: err.message })
  }
}

async function createFakePlayers(req, res) {
  const userNumbers  = req.body.user_numbers
  const playersList = [];
  let randomString = ""
  for (let userIndex = 0; userIndex < userNumbers; userIndex++) {
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

async function insertPlayers (playersList) {
    await UserModel
      .insertMany(playersList)
      .then(() => {
        console.log(`${playersList.length} fake user${(userNumbers > 1) && "s"} created.`)
      })
      .catch((err) => {
        console.error(err)
      })
}

async function deleteAllPlayers() {
  
}

module.exports = { getAll, createFakePlayers }