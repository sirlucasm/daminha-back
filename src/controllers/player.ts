import { Socket } from 'socket.io';

export class Player {
  public ready: boolean;

  constructor(public socket: Socket, public username: string) {
    this.ready = false;
  }

  public switchReady() {
    this.ready = !this.ready;
  }
}
