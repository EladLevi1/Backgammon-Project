import { Injectable } from '@angular/core';
import { PublicSocketIoService } from '../publicsocket-service/public-socket-io.service';
import { Observable, Observer } from 'rxjs';
import Notification from 'src/app/models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationSocketIoService {
  private socket;

  constructor(private publicSocketIO: PublicSocketIoService) {
    this.socket = this.publicSocketIO.getSocket();
  }

  public sendNotification(profileId : string, notification: Notification){
    this.socket.emit('sendNotification', {profileId, notification})
  }

  public onNewNotification(): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      this.socket.on('recievedNotification', (notification: any) => {
        observer.next(notification);
      });
    });
  }

  public markNotification(profileId : string, notification: Notification){
    this.socket.emit('markNotification', {profileId, notification})
  }

  public onMarkedNotification(): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      this.socket.on('notificationMarked', (notification: any) => {
        observer.next(notification);
      });
    });
  }

  public deleteNotification(profileId : string, notification: Notification){
    this.socket.emit('deleteNotification', {profileId, notification})
  }

  public onDeleteNotification(): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      this.socket.on('notificationDeleted', (notification: any) => {
        observer.next(notification);
      });
    });
  }
}
