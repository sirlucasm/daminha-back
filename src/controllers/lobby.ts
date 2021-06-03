import chalk from 'chalk';
import { Socket } from 'socket.io';
import { v4 as uuid } from 'uuid';

import { Room } from './room';

interface IRooms {
  [id: string]: Room;
}

export class Lobby {
  private rooms: IRooms;

  constructor(private max_rooms: number = 50) {
    this.rooms = {};
  }

  public getRoom = (id: string) => this.rooms[id];

  public getAllRooms = () => this.rooms;

  public createRoom(): string | null {
    if (Object.keys(this.rooms).length === this.max_rooms) {
      return null;
    }
    const id = uuid();
    this.rooms[id] = new Room(id);
    return id;
  }

  public deleteRoom(id: string): void {
    if (!this.getRoom(id)) return;

    delete this.rooms[id];
    console.log(chalk`[{yellow LOBBY}] Deleted room: ${id}`);
  }

  private getAvaliableRooms = () =>
    Object.values(this.rooms).map((room: Room) =>
      room.avaliable() ? room : null
    );

  public getSuitableRooms() {
    const avaliable_rooms = this.getAvaliableRooms();
    return avaliable_rooms;
  }

  public directEnterRoom(socket: Socket, room_id: string, username: string) {
    const room = this.getRoom(room_id);
    if (room && room.avaliable()) {
      room.addPlayer(socket, username);
    }
  }

  public quickJoin(socket: Socket, username: string) {
    console.log(chalk`[{yellow LOBBY}] ${username} matchmaking...`);
    const suitable_rooms = this.getSuitableRooms();

    const room_id =
      Object.keys(suitable_rooms).length > 0
        ? suitable_rooms[0].id
        : this.createRoom();

    this.directEnterRoom(socket, room_id, username);
  }
}
