import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import friendRequest from 'src/app/models/friendRequest.model';
import { PublicSocketIoService } from '../publicsocket-service/public-socket-io.service';

@Injectable({
  providedIn: 'root'
})
export class FriendsSocketIoService {
  private socket;

  constructor(private publicSocketService: PublicSocketIoService) {
    this.socket = this.publicSocketService.getSocket();
  }

  sendFriendRequest(request: friendRequest) {
    this.socket.emit('sendFriendRequest', request);
  }
  
  onFriendRequestReceived() {
    return new Observable<any>((observer) => {
      this.socket.on('receiveFriendRequest', (data) => {
        observer.next(data);
      });
    });
  }

  acceptFriendRequest(request: friendRequest) {
    this.socket.emit('acceptFriendRequest', request);
  }
  
  onFriendRequestAccepted() {
    return new Observable<any>((observer) => {
      this.socket.on('friendRequestAccepted', (data) => {
        observer.next(data);
      });
    });
  }

  rejectFriendRequest(request: friendRequest) {
    this.socket.emit('rejectFriendRequest', request);
  }

  onFriendRequestRejected() {
    return new Observable<any>((observer) => {
      this.socket.on('friendRequestRejected', (data) => {
        observer.next(data);
      });
    });
  }

  removeFriend(profileId: string, friendId: string) {
    this.socket.emit('friendRemove', {profileId, friendId});
  }

  onFriendRemoved() {
    return new Observable<string>((observer) => {
      this.socket.on('friendRemoved', (profileId: string) => {
        observer.next(profileId);
      });
    });
  }
}