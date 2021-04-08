const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const { checkYaku } = require('./CheckYaku')
const { calculatePoint } = require('./CalculatePoint')

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server,{
  cors: {
    origin: '*',
  }
});

app.use(cors());
app.use(express.json()); 
app.use(helmet())
app.use(morgan('combined'))
// tiny - 간단, combined - 좀 더 자세한 로그


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
  30,30,30,30,
  31,31,31,31,
  32,32,32,32,
  33,33,33,33,
  34,34,34,34,
  35,35,35,35,
  36,36,36,36
]
const shuffle = (array) => {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}


console.log(checkYaku([1,1,1,2,3,4,5,6,7,8,9,9,9,9]))

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; 



// app.get('/', (req, res) => {
//   res.cookie('session', '1', { httpOnly: true })
//   res.cookie('session', '1', { secure: true })
//   res.set({
//     'Content-Security-Policy': "script-src 'self' 'https://apis.google.com'"
//   })
//   res.send('it is working')} )

var roomIDDoraMapper = {};
var roomIDUraDoraMapper = {};

io.on('connection', (socket) => {
  socket.removeAllListeners
  console.log(socket.id, ' 연결됨')
  socket.emit('connected', socket.id)
  
  socket.on('joinroom', (roomID) => {
    roomID = parseInt(roomID)
    socket.join(roomID)
    let number = io.sockets.adapter.rooms.get(roomID).size
    console.log('방ID : ', roomID, number)
    if (number === 1) {
      io.in(roomID).emit('oneUser')
      console.log('emit ONEUSER')
    }
    if (number === 2) {
      io.in(roomID).emit('twoUser')
      console.log('emit TWOROOM')
    }
    if (number === 3) {
      socket.emit('fullRoom', 'fullRoom')
      socket.disconnect()
    }
  })


  socket.on('login', (data) => {
    console.log('login', socket.rooms)
    var roomIDArr = [...socket.rooms]
    var roomID = roomIDArr[roomIDArr.length-1]
    const mountain = shuffle([...Database])
    const dora = mountain.pop()
    const uraDora = mountain.pop()
    roomIDDoraMapper[roomID] = dora
    roomIDUraDoraMapper[roomID] = uraDora
  
    const playerHand1 = []
    for (var i=0; i < 34; i++) {
      playerHand1.push(mountain.pop())
    }
  
    const playerHand2 = []
    for (var i=0; i < 34; i++) {
      playerHand2.push(mountain.pop())
    }
    
    socket.name = data.name
  
    socket.emit('login', {
      playerHand: playerHand1,
      dora: dora,
      myTurn: true
    })
  
    socket.broadcast.emit('login',{
      playerHand: playerHand2,
      dora: dora,
      myTurn: false
    })
  })
  

  socket.on('forceDisconnect', () => {
    socket.disconnect();
    socket.emit('forceDisconnect', 'disconnected')
  })

  socket.on('decide', (data) => {
    console.log('emit decide')
    socket.broadcast.emit('opponentDecide', data)
  })

  socket.on('discard', (data) => {
    console.log('on discard', data)
    socket.broadcast.emit('opponentDiscard', data);

    console.log(data.order)
  })

  socket.on('ron', (data) => {
    console.log(data)
    var roomIDArr = [...socket.rooms]
    var roomID = roomIDArr[roomIDArr.length-1]
    console.log(roomID)
    var dora = roomIDDoraMapper[roomID]
    var uraDora = roomIDUraDoraMapper[roomID]
    const { tiles, ronCards } = data
    const { 
      pan, 
      fu, 
      yakuman, 
      yakuNameArr, 
      uradoraCount } = checkYaku(tiles, ronCards, dora, uraDora)
      // 도라, 뒷도라 모두 카운트하지만 판수에 반영하는건 도라만
      // 뒷도라 제외 만관이어야 하기 때문
    const point = calculatePoint(fu, pan, yakuman, yakuNameArr, uradoraCount)
      // 만관 조건 체크(뒷도라제외), 점수계산(뒷도라포함)
    if (point != 8000) {
      yakuNameArr.push(`우라도라 ${uradoraCount}`)
    } // 뒷도라제외 만관이상이면 역목록에추가

    socket.broadcast.emit('lose', { point, yakuNameArr })
    socket.emit('win', { point, yakuNameArr })
  })

  socket.on('itsMyTurn', (data) => {
    socket.emit('itsMyTurn', true)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected: ' + socket.id);
  });

})  


server.listen(3001, () => {
  console.log('it is running on port 3001')
})