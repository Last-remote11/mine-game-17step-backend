const shuffle = (array) => {
  let currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

const leaveAllRoom = (socket) => {
  rooms = socket.rooms
  rooms.forEach(room => {
    if (typeof(room) == "number")
    socket.leave(room)
  })
}

module.exports = { shuffle, leaveAllRoom }