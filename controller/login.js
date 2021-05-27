const jwt = require('jsonwebtoken')
const redis = require('redis');
const redisClient = redis.createClient({host: 'redis', url: process.env.REDIS_URI});


const login = async (req, res, db, bcrypt) => {

  const { name, password } = req.body

  try {
    let nameAndToken = await loginNotToken(name, password, db, bcrypt)
    console.log('nameandtoken', nameAndToken)
    res.json(nameAndToken)
  } catch(e) {
    res.status(400).json(e)
  }
}

const loginNotToken = async (name, password, db, bcrypt) => {
  // 토큰 없이 로그인, 로그인 성공하면 토큰과 이름을 비동기적으로 반환
  if (!name || !password ) {
    return Promise.reject('잘못된 제출 형식');
  }

  let userdata = await db.select('*').from('users').where('name', '=', name)
  if (userdata.length === 0) {
    throw Error('가입된 정보 없음')
  }
  let isValid = await bcrypt.compare(password, userdata[0].hash)
  if (isValid) {
    let jwt = signToken(userdata)
    console.log(jwt)
    await setToken(jwt, userdata[0].name)
    return { name: userdata[0].name, token: jwt }
  } else {
    throw Error('비밀번호 틀림')
  }
  // return db.select('*').from('users')
  //   .where('name', '=', name)
  //   .then(data => {
  //     const isValid = bcrypt.compareSync(password, data[0].hash)
  //     if (isValid) {
  //       return data
  //     } else {
  //       Promise.reject("비밀번호 틀림")
  //     }
  //   })
  //   .
}

const signToken = (userdata) => {
  const jwtPayload = { name : userdata[0].name }
  console.log('jwtpayload', jwtPayload)
  return jwt.sign(jwtPayload, 'JWT_SECRET', { expiresIn: '1 days' })
}

const setToken = async (key, value) => {
  redisClient.hset('token', key, value, (err, reply) => {
    if (!reply || err) {
      console.log(err)
      throw Error('토큰 저장하는 중 오류 발생')
    }
  })
}


module.exports = {
  login
}