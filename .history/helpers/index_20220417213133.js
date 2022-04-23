function resJsonLengthAndData(res) {
  res.status(200).json({
    status: 'success',
    results: hundredPlayers.length,
    data: { hundredPlayers }
  })
}
module.exports = { resJsonLengthAndData }