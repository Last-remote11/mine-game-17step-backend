// 중복된 닉네임이 있는지 확인

const duplicate = async (req, res, db, bcrypt) => {
  const { name } = req.body
  try {
    const duplicateResult = await db.select('*')
    .from('users')
    .where('name', '=', name)

    if (duplicateResult.length == 0) {
      res.json(false)
    } else {
      res.json(true)
    }
  } catch(e) {
    res.status(400).json('중복된 이름이 있습니다.')
  }
}

module.exports = {
  duplicate
}