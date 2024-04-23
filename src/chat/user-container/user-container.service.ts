import { Socket } from 'socket.io';

export class UserContainerService {
  private map: Map<string, Socket> = new Map<string, Socket>();

  constructor() {}

  addUser(username: string, socket: Socket) {
    this.map.set(username, socket);
  }

  deleteUser(socket: Socket) {
    this.map.forEach((value, key) => {
      if (socket === value) this.map.delete(key);
    });
  }

  getUser(username: string) {
    return this.map.get(username);
  }
}
