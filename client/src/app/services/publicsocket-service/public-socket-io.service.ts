import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class PublicSocketIoService {
  private socket!: Socket;

  constructor() {
    if (!this.socket) {
      this.socket = io('http://localhost:8080');
    }
  }

  getSocket(): Socket {
    return this.socket;
  }
}
