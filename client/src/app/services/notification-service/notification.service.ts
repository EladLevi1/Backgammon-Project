import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Notification from 'src/app/models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private url = 'http://localhost:8080/Backgammon/Notifications/';

  constructor(private httpClient: HttpClient) { }

  getAllNotifications(){
    return this.httpClient.get<Notification[]>(this.url);
  }

  getNotificationsForProfile(profileId: string) {
    return this.httpClient.get<Notification[]>(this.url + 'profile/' + profileId);
  }

  sendNotification(notification: Notification) {
    return this.httpClient.post<Notification>(this.url, notification);
  }

  updateNotificationStatus(notificationId: string, status: 'read' | 'unread') {
    const requestBody = { status: status };
    return this.httpClient.put<Notification>(this.url + notificationId, requestBody);
  }

  setAllProfileNotificationsRead(profileId : string){
    return this.httpClient.put<Notification[]>(this.url + 'read/' + profileId, {});
  }

  deleteNotification(notificationId: string) {
    return this.httpClient.delete<Notification[]>(this.url + notificationId);
  }

  deleteAllProfileNotifications(profileId: string) {
    return this.httpClient.delete(this.url + 'deleteAll/' + profileId);
  }
}