import chalk from 'chalk';
import { Socket } from 'socket.io';

import { Player } from './player';

interface IPlayers {
  player1?: Player;
  player2?: Player;
}

export class Room {
  private players: IPlayers;
  private board: Array<number>;

  constructor(public id: string) {
    this.players = {};
    this.board = [];
  }

  public returnState = () => ({
    players: this.players,
    board: this.board,
  });

  public avaliable = (): boolean => Object.keys(this.players).length < 2;

  public addPlayer(socket: Socket, username: string): void {
    if (this.players[socket.id]) return;

    const player = new Player(socket, username);
    socket['current_room_id'] = this.id;
    this.players[socket.id] = player;
    player.socket.emit('current_room_state', this.returnState());
    console.log(chalk`[{cyan ROOM}] ${player.username} joined.`);
  }

  public restart() {}

  public init() {}
}
