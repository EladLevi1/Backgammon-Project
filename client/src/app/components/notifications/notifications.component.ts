import { Component } from '@angular/core';
import Profile from 'src/app/models/profile.model';
import { NotificationService } from 'src/app/services/notification-service/notification.service';
import { ProfileService } from 'src/app/services/profile-service/profile.service';
import Notification from 'src/app/models/notification.model';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent {
  profile: Profile = new Profile();
  notifications: Notification[] = [];

  constructor(private profileService: ProfileService, private notificationService: NotificationService){}

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
  }

  markAllAsRead(){
    this.notificationService.setAllProfileNotificationsRead(this.profile._id).subscribe(() => {
      console.log("Inside the subscription");  // Check if this is logged
      this.notifications.forEach(n => {
          n.status = 'read';
      });
    },
    (error) => {
        console.log(error.error)
    });
  
  }

  markNotificationAsRead(notification: Notification) {
    this.notificationService.updateNotificationStatus(notification._id, 'read').subscribe((updatedNotification) => {
        this.notifications = this.notifications.map(n => 
            n._id === updatedNotification._id ? updatedNotification : n
        );
    },
    (error) => {
        console.log(error.error);
    });
  }

  deleteNotification(notification: Notification){
    this.notificationService.deleteNotification(notification._id).subscribe(() => {
      this.notifications = this.notifications.filter(n => n._id !== notification._id);
    },
    (error) => {
      console.log(error.error)
    });
  }

  deleteAllNotifications(){
    this.notificationService.deleteAllProfileNotifications(this.profile._id).subscribe(() => {
      this.notifications = [];
    },
    (error) => {
      console.log(error.error)
    });
  }
}