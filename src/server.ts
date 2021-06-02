import { Socket, Server } from 'socket.io';
import chalk from 'chalk';

const PORT = parseInt(process.env.PORT, 10) || 3333;
const io = new Server(PORT, {
  allowEIO3: true,
});
console.log(chalk`[{magenta SERVER}] listening on port ${PORT}.`);

io.on('connection', (socket: Socket) => {
  console.log(chalk`[{green IO}] New Connection: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(chalk`[{red IO}] Disconnected: ${socket.id}`);
  });
});
