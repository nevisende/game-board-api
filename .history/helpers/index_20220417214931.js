function resJsonLengthAndData(res, data) {
  res.status(200).json({
    status: 'success',
    results: data.length,
    data: { data }
  })
}
module.exports = { resJsonLengthAndData }