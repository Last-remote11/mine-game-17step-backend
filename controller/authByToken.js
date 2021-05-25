const authByToken = async (req, res, redisClient) => {

  const { authorization } = req.headers

  return redisClient.hget('token', authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(400).json('토큰 만료')
    }
    return res.json({name: reply})
  })
}

module.exports = {
  authByToken
}