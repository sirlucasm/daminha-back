import { Socket, Server } from 'socket.io';
import chalk from 'chalk';

import { Lobby } from './entities/lobby';

const PORT = parseInt(process.env.PORT, 10) || 3333;
const io = new Server(PORT, {
  allowEIO3: true,
});
console.log(chalk`[{magenta SERVER}] listening on port ${PORT}.`);

const lobby = new Lobby(50);
lobby.createRoom();

io.on('connection', (socket: Socket) => {
  console.log(chalk`[{green IO}] New Connection: ${socket.id}`);

  socket.on('enter_game', ({ username }) => {
    lobby.quickJoin(socket, username);
  });

  socket.on('enter_with_id', ({ room_id, username }) => {
    lobby.directEnterRoom(socket, room_id, username);
  });

  socket.on('disconnect', () => {
    console.log(chalk`[{red IO}] Disconnected: ${socket.id}`);
  });
});
