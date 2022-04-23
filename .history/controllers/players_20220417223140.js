const Player = require('../models/players')
const randomWords = require('random-words');
const index = require('../index')
const helpers = require('../helpers')


async function getHighHundredRanked(req, res) { 
  try {
    if (redisClient.connected) {
      // Redis bağlıysa
      redisClient.keys("User*", async (err, keys) => {
        if (keys.length > 0) {
          // Rediste veri varsa
          // Önce güncelle
          Player.find((err, doc) => {
            doc.forEach((item) => {
              let userName = "User:" + item._doc._id;

              redisClient.get(userName, (err, user) => {
                var data = JSON.stringify(item._doc);
                console.log(data);
                redisClient.set(userName, data, () => {});
              });
            });
          });
          //Sonra Göster
          let players = [];
          for (var i = 0; i < keys.length; i++) {
            redisClient.get(keys[i], (err, obj) => {
              players.push(JSON.parse(obj));

              if (players.length == keys.length - 1) {
                players.sort((a, b) => b.dailyDiff - a.dailyDiff);
                res.status(200).json(players);
              }
            });
          }
        } else {
          // Rediste veri yoksa
          Player.find((err, doc) => {
            doc.forEach((item) => {
              let userName = "User:" + item._doc._id;

              redisClient.get(userName, (err, user) => {
                if (user == null) {
                  var data = JSON.stringify(item._doc);
                  redisClient.set(userName, data, () => {});
                }
              });
            });

            doc.sort((a, b) => b.dailyDiff - a.dailyDiff);
            res.status(200).json(doc);
          });
          // const players = await Player.find();
          // players.sort((a, b) => b.dailyDiff - a.dailyDiff);
          // res.status(200).json(players);
          // players.sort((a, b) => b.dailyDiff - a.dailyDiff);
          // res.status(200).json(players);
        }
      });
    } else {
      // Redis bağlı değilse
      const players = await Player.find();
      players.sort((a, b) => b.dailyDiff - a.dailyDiff);
      res.status(200).json(players);
    }
  } catch (err) {
    res.status(404).json({
      message: err.message,
    });
  }
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

  await index.redisClient.flushAll()
}

module.exports = { getHighHundredRanked, createFakePlayers, deleteAllPlayers }