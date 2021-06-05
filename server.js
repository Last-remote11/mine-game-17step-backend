const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Promise = require('bluebird');
const helmet = require('helmet');
const redis = require("redis");
const bcrypt = require('bcryptjs');
const knex = require('knex');
Promise.promisifyAll(require("redis"));

const { shuffle, leaveAllRoom } = require('./functions')
const { checkYaku } = require('./CheckYaku')
const { calculatePoint } = require('./CalculatePoint')

const app = express();
const server = require('http').createServer(app);

const corsOptions = {
  origin: ['https://last-remote11.github.io', 'http://localhost:3001', 'http://localhost:3002']
}

const io = require('socket.io')(server,{
  cors: corsOptions
});


// docker-compose
const redisClient = redis.createClient({host: 'redis', url: process.env.REDIS_URL});

// const db = knex({
//   client: 'pg',
//   connection: {
//     host: process.env.POSTGRES_HOST,
//     user: process.env.POSTGRES_USER,
//     password: process.env.POSTGRES_PASSWORD,
//     database: process.env.POSTGRES_DB
//   }
// });

// // heroku
// redisClient = redis.createClient(process.env.REDIS_URL);

db = knex({
  client: 'pg',
  connection: {
    connectionString : process.env.DATABASE_URL,
    ssl : true
  }
});



const { signup } = require('./controller/signup')
const { login } = require('./controller/login')
const { authByToken } = require('./controller/authByToken')
const duplicate = require('./controller/duplicate') // 닉중복확인용, 미구현


app.use(cors());


app.use(express.json()); 
app.use(helmet())
app.use(morgan('combined'))

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; 

const Database = [
  1,1,1,1,
  2,2,2,2,
  3,3,3,3,
  4,4,4,4,
  5,5,5,5,
  6,6,6,6,
  7,7,7,7,
  8,8,8,8,
  9,9,9,9,
  11,11,11,11,
  12,12,12,12,
  13,13,13,13,
  14,14,14,14,
  15,15,15,15,
  16,16,16,16,
  17,17,17,17,
  18,18,18,18,
  19,19,19,19,
  21,21,21,21,
  22,22,22,22,
  23,23,23,23,
  24,24,24,24,
  25,25,25,25,
  26,26,26,26,
  27,27,27,27,
  28,28,28,28,
  29,29,29,29,
  31,31,31,31,
  32,32,32,32,
  33,33,33,33,
  34,34,34,34,
  35,35,35,35,
  36,36,36,36,
  37,37,37,37
]


app.get('/', (req, res) => {
  res.send('it is working')
})

app.post('/login', cors(corsOptions), (req, res) => { login(req, res, db, bcrypt) })

app.post('/signup', cors(corsOptions), (req, res) => { signup(req, res, db, bcrypt) })

app.get('/authByToken', cors(corsOptions), (req, res) => { authByToken(req, res, redisClient) })


const roomIDNameMapper = {}
const currentRoomState = new Set() // 활성화된 방
const randomRoomID = Math.floor(Math.random()*100000)

const saveSocketRoomID = (socketID, roomID) => { // key: 소켓id value: 방번호(id)
  redisClient.hset('roomID', socketID, roomID, (err, reply) => {
    reply ? console.log(reply, '방id저장완료') : console.log(err)
  })
} 

const saveDora = (roomID, dora) => { // key: 방번호 value: 도라번호
  redisClient.hset('dora', roomID, dora, (err, reply) => {
    reply ? console.log(reply,'도라저장완료') : console.log(err,'에라')
  })
} 

const saveUradora = (roomID, uradora) => { // key: 방번호 value: 뒷도라번호
  redisClient.hset('uradora', roomID, uradora, (err, reply) => {
    reply ? console.log(reply, '우라도라저장완료') : console.log(err)
  })
} 

const saveTurn = (roomID, turn) => { // key: 방번호 value: 턴수
  redisClient.hset('turn', roomID, turn, (err, reply) => {
    reply ? console.log(reply, '턴수저장완료') : console.log(err)
  })
}

const getHValue = async (hash, key) => { 
  let result = await redisClient.hgetallAsync(hash)
  return result[key]
}


const checkRoomPeople = {

  '1': (roomID, joinData) => {
    roomIDNameMapper[roomID] = joinData.name
    io.in(roomID).emit('oneUser')
    console.log('emit ONEUSER')
  },
  '2': (roomID, joinData) => {
    let user1 = roomIDNameMapper[roomID]
    console.log('tworoom', joinData)
    let user2 = joinData.name
    io.in(roomID).emit('twoUser', { roomID, user1, user2 })
    currentRoomState.add(roomID)
    console.log('emit TWOROOM')
  },
  '3': () => {
    socket.emit('fullRoom', 'fullRoom')
    socket.disconnect()
  }
}

io.on('connection', (socket) => {
  socket.removeAllListeners
  console.log(socket.id, ' 연결됨')
  socket.emit('connected', socket.id)
  
  socket.on('joinroom', (joinData) => {
    console.log(joinData)
    roomID = parseInt(joinData.joinID)
    leaveAllRoom(socket)
    socket.join(roomID)
    saveSocketRoomID(socket.id, roomID)
    let roomSize = io.sockets.adapter.rooms.get(roomID).size
    console.log('방ID : ', roomID, roomSize)

    checkRoomPeople[roomSize](roomID, joinData)
  })

  socket.on('randomMatch', (joinData) => {
    console.log('randomMatch!')
    let whereToGo = 1
    while (currentRoomState.has(whereToGo)) {
      whereToGo++
    }
    leaveAllRoom(socket)
    socket.join(whereToGo)
    saveSocketRoomID(socket.id, whereToGo)
    let roomSize = io.sockets.adapter.rooms.get(whereToGo).size
    console.log('랜덤매치 방ID : ', whereToGo, roomSize)

    checkRoomPeople[roomSize](whereToGo, joinData)
  })


  socket.on('login', (data) => {
    console.log('login, 방목록', socket.rooms)
    let roomIDArr = [...socket.rooms]
    let roomID = roomIDArr[roomIDArr.length-1]
    const mountain = shuffle([...Database])
    const dora = mountain.pop()
    const uradora = mountain.pop()
    saveDora(roomID, dora)
    saveUradora(roomID, uradora)
    saveTurn(roomID, 0)
  
    const playerHand1 = []
    for (let i=0; i < 34; i++) {
      playerHand1.push(mountain.pop())
    }
  
    const playerHand2 = []
    for (let i=0; i < 34; i++) {
      playerHand2.push(mountain.pop())
    }
    console.log('셔플')
    
    socket.name = data.name
  
    socket.emit('login', {
      playerHand: playerHand1,
      dora: dora,
      myTurn: true
    })
  
    socket.in(roomID).broadcast.emit('login', {
      playerHand: playerHand2,
      dora: dora,
      myTurn: false
    })
    console.log('배패')
  })
  

  socket.on('forceDisconnect', () => {
    let roomIDArr = [...socket.rooms]
    let roomID = roomIDArr[roomIDArr.length-1]
    socket.disconnect();
    socket.in(roomID).broadcast.emit('forceDisconnect', '상대방이 게임을 떠났습니다.')
  })

  socket.on('decide', (data) => {
    let roomIDArr = [...socket.rooms]
    console.log(socket.rooms)
    let roomID = roomIDArr[roomIDArr.length-1]
    console.log('emit decide')
    socket.in(roomID).broadcast.emit('opponentDecide', data)
  })

  socket.on('discard', async (data) => {
    let roomIDArr = [...socket.rooms]
    let roomID = roomIDArr[roomIDArr.length-1]
    let turn = await getHValue('turn', roomID)
    console.log('턴수??', turn)
    redisClient.hincrby('turn', roomID.toString(), 1)
    if (turn === '34') {
      console.log('비김')
      console.log(turn)
      io.in(roomID).emit('draw')
     } else {
      console.log('안비김')
      socket.in(roomID).broadcast.emit('opponentDiscard', data);
     }
  })

  socket.on('ron', async (data) => {
    console.log('론 정보', data)
    let roomIDArr = [...socket.rooms]
    let roomID = roomIDArr[roomIDArr.length-1]
    let dora = await getHValue('dora', roomID)
    let uradora = await getHValue('uradora', roomID)


    const { tiles, ronCard, oya, soon } = data
    const { 
      pan, 
      fu, 
      yakuman, 
      yakuNameArr, 
      uradoraCount } = checkYaku(tiles, ronCard, dora, uradora, oya, soon)

    const point = calculatePoint(pan, fu, yakuman, uradoraCount)
    panWithUradora = pan
    if (point != -8000) {
      panWithUradora = pan + uradoraCount
      yakuNameArr.push(`우라도라 ${uradoraCount}`)
    }

    tiles.sort((a, b) => a - b)

    socket.to(roomID).broadcast.emit('lose',
    { panWithUradora, yakuman, point, yakuNameArr, tiles, uradora })

    socket.emit('win', { panWithUradora, yakuman, point, yakuNameArr, tiles, uradora })
  })
  
  socket.on('accept', () => {
    let roomIDArr = [...socket.rooms]
    let roomID = roomIDArr[roomIDArr.length-1]
    socket.to(roomID).broadcast.emit('opponentAccept')
  })

  socket.on('disconnect', async () => {
    let roomID = await getHValue('roomID', socket.id)
    roomID = Number(roomID)
    console.log('방번호', roomID)
    socket.to(roomID).broadcast.emit('playerLeft')
    redisClient.hdel('dora', '123')
    redisClient.hdel('uradora', '123')
    redisClient.hdel('turn', '123')
    redisClient.hdel('roomID', socket.id)
    currentRoomState.delete(roomID)
    console.log('user disconnected: ' + socket.id + ' / roomID: ' + roomID);
  });
})  


server.listen(process.env.PORT || 3000, () => {
  console.log(`server is running at ${process.env.PORT || 3000}`)
})