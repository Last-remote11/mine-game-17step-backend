const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

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

const mountain = shuffle(Database)

const app = express();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; 

app.use(cors());
app.use(express.json()); 
app.use(morgan('tiny'))
// tiny - 간단, combined - 좀 더 자세한 로그

app.get('/', (req, res) => {
  res.cookie('session', '1', { httpOnly: true })
  res.cookie('session', '1', { secure: true })
  res.set({
    'Content-Security-Policy': "script-src 'self' 'https://apis.google.com'"
  })
  res.send('it is working')} )

app.put('/giveCard', (req, res) => {
  const playerHand = []
  for (var i=0; i < 14; i++) {
    playerHand.push(mountain.pop())
  }
  res.json(playerHand)
})

app.post('/submit', (req, res) => {
  const { submited } = req.body;
  res.status(200).json('정상제출')
})

app.post('/discard', (req, res) => {
  const { discard } = req.body;
  console.log(discard)
  if (discard.order === 36) {
    res.status(200).json({
      ...discard,
      ron: true,
      score: 16000
    })
  } else {
    res.status(200).json({
      ...discard,
      ron: false,
      score: false
    })
  }
})

app.post('/ron', (req, res) => {
  const { ronCard } = req.body;
  const final = submited + ronCard
})

app.listen(3001, () => {
  console.log('it is running on port 3001')
})