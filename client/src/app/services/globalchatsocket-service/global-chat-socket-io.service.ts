import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { PublicSocketIoService } from '../publicsocket-service/public-socket-io.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalChatSocketIoService {
  private socket;

  constructor(private publicSocketIO: PublicSocketIoService) {
    this.socket = this.publicSocketIO.getSocket();
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
