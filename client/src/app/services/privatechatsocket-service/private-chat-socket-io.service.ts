import { Injectable } from '@angular/core';
import { PublicSocketIoService } from '../publicsocket-service/public-socket-io.service';
import { Observable, Observer } from 'rxjs';
import ChatMessage from 'src/app/models/chatMessage.model';

@Injectable({
  providedIn: 'root'
})
export class PrivateChatSocketIoService {
  private socket;

  constructor(private publicSocketIO: PublicSocketIoService) {
    this.socket = this.publicSocketIO.getSocket();
  }

  public joinChat(chatId: string, profileId: string){
    this.socket.emit('joinChat', {chatId, profileId})
  }

  public onJoinChat() {
    return new Observable((observer: any) => {
        this.socket.on('profileJoinedChat', (profileId) => {
          observer.next(profileId);
        });
    });
  }

  public leaveChat(chatId: string, profileId: string){
    this.socket.emit('leaveChat', {chatId, profileId})
  }

  public onLeftChat() {
    return new Observable((observer: any) => {
        this.socket.on('profileLeftChat', (profileId) => {
            observer.next(profileId);
        });
    });
  }

  public sendPrivateMessage(chatId: string, message: ChatMessage): void {
    this.socket.emit('sendPrivateMessage', {chatId, message});
  }

  public onNewPrivateMessage(): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      this.socket.on('receivePrivateMessage', (message: any) => {
        observer.next(message);
      });
    });
  }

  public onCurrentUsersInChat(): Observable<string[]> {
    return new Observable((observer: Observer<string[]>) => {
        this.socket.on('currentUsersInChat', (userIds: string[]) => {
          console.log(userIds);
          observer.next(userIds);
        });
    });
  }
}
