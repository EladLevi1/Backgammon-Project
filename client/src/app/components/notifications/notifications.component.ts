import { Component } from '@angular/core';
import Profile from 'src/app/models/profile.model';
import { NotificationService } from 'src/app/services/notification-service/notification.service';
import { ProfileService } from 'src/app/services/profile-service/profile.service';
import Notification from 'src/app/models/notification.model';
import { NotificationSocketIoService } from 'src/app/services/notificationsocket-service/notification-socket-io.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent {
  profile: Profile = new Profile();
  notifications: Notification[] = [];

  constructor(private profileService: ProfileService, private notificationService: NotificationService,
    private notificationSocketIO: NotificationSocketIoService){}

  ngOnInit(){
    this.profileService.getProfileByToken().subscribe((p) => {
      this.profile = p;

      this.notificationService.getNotificationsForProfile(this.profile._id).subscribe((notifications) => {
        this.notifications = notifications.sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      },
      (error) => {
          console.log(error.error)
      });
    },
    (error) => {
      console.log(error.error)
    })

    this.notificationSocketIO.onNewNotification().subscribe((notification) => {
      this.notifications.push(notification);
    })
  }
  
  markNotificationAsRead(notification: Notification) {
    this.notificationService.updateNotificationStatus(notification._id, 'read').subscribe((updatedNotification) => {
      this.notifications = this.notifications.map(n => 
        n._id === updatedNotification._id ? updatedNotification : n
      );
      this.notificationSocketIO.markNotification(this.profile._id, notification);
    },
    (error) => {
        console.log(error.error);
    });

  }

  deleteNotification(notification: Notification){
    this.notificationService.deleteNotification(notification._id).subscribe(() => {
      this.notifications = this.notifications.filter(n => n._id !== notification._id);

      this.notificationSocketIO.deleteNotification(this.profile._id, notification);
    },
    (error) => {
      console.log(error.error)
    });

  }
  
  markAllAsRead(){
    this.notificationService.setAllProfileNotificationsRead(this.profile._id).subscribe(() => {
      this.notifications.forEach(n => {
        n.status = 'read';

        this.notificationSocketIO.markNotification(this.profile._id, n);
      });
    },
    (error) => {
        console.log(error.error)
    });
  }
    
  deleteAllNotifications(){
    this.notificationService.deleteAllProfileNotifications(this.profile._id).subscribe(() => {
      this.notifications.forEach(n => {
        this.notificationSocketIO.deleteNotification(this.profile._id, n);
      });

      this.notifications = [];
    },
    (error) => {
      console.log(error.error)
    });
  }
}