const signup = async (req, res, db, bcrypt) => {
  const { name, password } = req.body
  const hash = bcrypt.hashSync(password, 8)
  console.log(name, hash)
  try {
    const dbInsert = await db.insert({ name: name, hash: hash}).into('users').returning('name')
    res.json(dbInsert)
  } catch(e) {
    res.status(400).json('중복된 이름이 있습니다.')
  }
}

module.exports = {
  signup
}