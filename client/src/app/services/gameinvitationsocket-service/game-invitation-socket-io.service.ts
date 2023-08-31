import { Injectable } from '@angular/core';
import { PublicSocketIoService } from '../publicsocket-service/public-socket-io.service';
import GameInvitation from 'src/app/models/gameInvitation.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameInvitationSocketIoService {
  private socket;

  constructor(private publicSocketService: PublicSocketIoService) {
    this.socket = this.publicSocketService.getSocket();
  }

  sendGameInvitation(gameInvitation: GameInvitation) {
    this.socket.emit('sendGameInvitation', gameInvitation);
  }

  onGameInvitationReceived() {
    return new Observable<any>((observer)=>{
      this.socket.on('recievedGameInvitation', (invitation) => {
        observer.next(invitation);
      });
    });
  }

  acceptGameInvitation(gameInvitation: GameInvitation) {
    this.socket.emit('acceptGameInvitation', gameInvitation);
  }

  onGameInvitationAccepted(){
    return new Observable<GameInvitation>((observer)=>{
      this.socket.on('gameInvitationAccepted', (invitation) => {
        observer.next(invitation);
      });
    });
  }

  rejectGameInvitation(gameInvitation: GameInvitation){
    this.socket.emit('rejectGameInvitation', gameInvitation);
  }

  onGameInvitationRejected(){
    return new Observable<GameInvitation>((observer)=>{
      this.socket.on('gameInvitationRejected', (invitation) => {
        observer.next(invitation);
      });
    });
  }
}
