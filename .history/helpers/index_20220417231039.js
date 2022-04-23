function resJsonLengthAndData(res, doc) {
  res.status(200).json({
    status: 'success',
    results: doc.length,
    data: { doc }
  })
}

function getTopHundred
module.exports = { resJsonLengthAndData }

