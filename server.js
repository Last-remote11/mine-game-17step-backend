const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const redis = require("redis");
const client = redis.createClient();

const { checkYaku } = require('./CheckYaku')
const { shuffle } = require('./functions')
const { calculatePoint } = require('./CalculatePoint')

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server,{
  cors: {
    origin: '*',
  }
});

const redis = 

app.use(cors());
app.use(express.json()); 
app.use(helmet())
app.use(morgan('combined'))
// tiny - 간단, combined - 좀 더 자세한 로그

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
} )

const socketIDRoomMapper = {};

const roomIDDoraMapper = {};
const roomIDUraDoraMapper = {};
const roomIDTurnMapper = {};

const checkRoomPeople = {
  '1': (roomID) => {
    io.in(roomID).emit('oneUser')
    console.log('emit ONEUSER')
  },
  '2': (roomID) => {
    io.in(roomID).emit('twoUser', roomID)
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
  
  
  socket.on('joinroom', (roomID) => {
    roomID = parseInt(roomID)
    socket.join(roomID)
    socketIDRoomMapper[socket.id] = roomID
    let number = io.sockets.adapter.rooms.get(roomID).size
    console.log('방ID : ', roomID, number)

    checkRoomPeople[number](roomID)
  })


  socket.on('randomMatch', () => {
    console.log('randomMatch!')
  })


  socket.on('login', (data) => {
    console.log('login, 방목록', socket.rooms)
    console.log('방번호 도라', roomIDDoraMapper)
    let roomIDArr = [...socket.rooms]
    let roomID = roomIDArr[roomIDArr.length-1]
    const mountain = shuffle([...Database])
    const dora = mountain.pop()
    const uradora = mountain.pop()
    roomIDDoraMapper[roomID] = dora
    roomIDUraDoraMapper[roomID] = uradora
    roomIDTurnMapper[roomID] = 0
  
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
    socket.disconnect();
    socket.emit('forceDisconnect', 'disconnected')
  })

  socket.on('decide', (data) => {
    let roomIDArr = [...socket.rooms]
    let roomID = roomIDArr[roomIDArr.length-1]
    console.log('emit decide')
    socket.in(roomID).broadcast.emit('opponentDecide', data)
  })

  socket.on('discard', (data) => {
    let roomIDArr = [...socket.rooms]
    let roomID = roomIDArr[roomIDArr.length-1]
    let turn = roomIDTurnMapper[roomID]
    roomIDTurnMapper[roomID]++
    console.log('on discard', data, 'turn', turn)
    
    if (turn === 34) {
      console.log('유국')
      io.in(roomID).emit('draw')
    } else {
      socket.in(roomID).broadcast.emit('opponentDiscard', data);
      console.log(data.order)
    }
  })

  socket.on('ron', (data) => {
    console.log(data)
    let roomIDArr = [...socket.rooms]
    let roomID = roomIDArr[roomIDArr.length-1]
    let dora = roomIDDoraMapper[roomID]
    let uradora = roomIDUraDoraMapper[roomID]

    const { tiles, ronCard, oya, soon } = data
    console.log('tiles', tiles,'ronCard', ronCard)
    const { 
      pan, 
      fu, 
      yakuman, 
      yakuNameArr, 
      uradoraCount } = checkYaku(tiles, ronCard, dora, uradora, oya, soon)
    console.log(pan,'판', 
      fu,'부', 
      yakuman,'역만', 
      yakuNameArr, 
      uradoraCount,'도라갯수')
      // 도라, 뒷도라 모두 카운트하지만 판수에 반영하는건 도라만
      // 뒷도라 제외 만관이어야 하기 때문
    const point = calculatePoint(pan, fu, yakuman, uradoraCount)
      // 만관 조건 체크(뒷도라제외), 점수계산(뒷도라포함)
    if (point != -8000) {
      yakuNameArr.push(`우라도라 ${uradoraCount}`)
    } // 뒷도라제외 만관이상이면 역목록에추가
    tiles.sort((a, b) => a - b)
    socket.to(roomID).broadcast.emit('lose', { pan, yakuman, point, yakuNameArr, tiles, uradora })
    socket.emit('win', { pan, yakuman, point, yakuNameArr, tiles, uradora })
  })
  
  socket.on('accept', () => {
    let roomIDArr = [...socket.rooms]
    let roomID = roomIDArr[roomIDArr.length-1]
    socket.to(roomID).broadcast.emit('opponentAccept')
  })

  socket.on('disconnect', () => {
    let roomID = socketIDRoomMapper[socket.id]
    socket.to(roomID).broadcast.emit('playerLeft')
    delete roomIDDoraMapper[roomID]
    delete roomIDUraDoraMapper[roomID]
    delete roomIDTurnMapper[roomID]
    delete socketIDRoomMapper[socket.id]
    console.log('user disconnected: ' + socket.id + '/ roomID: ' + roomID);
  });
})  


server.listen(process.env.PORT || 3000, () => {
  console.log(`server is running at ${process.env.PORT || 3000}`)
})