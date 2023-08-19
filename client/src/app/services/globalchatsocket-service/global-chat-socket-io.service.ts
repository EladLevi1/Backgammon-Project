import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class GlobalChatSocketIoService {
  private socket;

  constructor() {
    this.socket = io('http://localhost:8080');
  }

  public sendGlobalMessage(message: any): void {
    this.socket.emit('sendGlobalMessage', message);
  }

  public onNewGlobalMessage(): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      this.socket.on('receiveGlobalMessage', (message: any) => {
        observer.next(message);
      });
    });
  }
}
