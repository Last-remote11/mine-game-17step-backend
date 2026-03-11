import { Socket } from 'socket.io';

export const shuffle = <T>(array: T[]): T[] => {
  let currentIndex: number = array.length;
  let temporaryValue: T;
  let randomIndex: number;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
};

export const leaveAllRoom = (socket: Socket): void => {
  const rooms = socket.rooms;
  rooms.forEach((room: string) => {
    if (typeof room === "number") {
      socket.leave(room);
    }
  });
};
