const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

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
app.use(morgan('tiny'))
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




process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; 



// app.get('/', (req, res) => {
//   res.cookie('session', '1', { httpOnly: true })
//   res.cookie('session', '1', { secure: true })
//   res.set({
//     'Content-Security-Policy': "script-src 'self' 'https://apis.google.com'"
//   })
//   res.send('it is working')} )



app.put('/start', (req, res) => {
  // 패의 order 숫자로 구성된 136길이의 큐를 섞어
  // 두명의 플레이어에게 각각 14개씩 줌
  // 프론트엔드는 order를 받고 저장되어있는 카드 데이터를 참고하여 패를 구성
  // (state.switchHand.cards)
  const mountain = shuffle(Database)
  const dora = mountain.pop()
  const uraDora = mountain.pop()
  const playerHand1 = []
  for (var i=0; i < 34; i++) {
    playerHand1.push(mountain.pop())
  }

  const playerHand2 = []
  for (var i=0; i < 34; i++) {
    playerHand2.push(mountain.pop())
  }

  res.json({
    playerHand: playerHand1,
    dora: dora
  })
})



app.post('/submit', (req, res) => {
  const { submited } = req.body;
  res.status(200).json('정상제출')
})

app.post('/discard', (req, res) => {
  const discard = req.body
  console.log(discard.card.order)
  if (discard.card.order === 36 | 35 | 34) {
    discard.card.ron = true
    discard.card.score = 16000
    res.status(200).json(
      discard
    )
  } else {
    discard.card.ron = false
    discard.card.score = 0
    res.status(200).json(
      discard
    )
  }
})

app.post('/ron', (req, res) => {
  const { ronCard } = req.body;
  const final = submited + ronCard
})


io.on('connection', (socket) => {
  console.log(socket.id, '소켓아이디')

  socket.on('login', (data) => {
    
    socket.name = data.name
    socket.id = data.id

    console.log(data)
    io.emit('login', 'Login Success !')
  })

  socket.on('forceDisconnect', function() {
    socket.disconnect();
    socket.emit('forceDisconnect', 'disconnected')
  })

  socket.on('discard', (data) => {
    socket.discard = data
    io.emit('discard', socket.discard)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected: ' + socket.name);
  });

})  



server.listen(3001, () => {
  console.log('it is running on port 3001')
})