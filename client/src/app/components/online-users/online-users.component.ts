import { Component } from '@angular/core';
import Profile from 'src/app/models/profile.model';
import { ConnectionSocketIoService } from 'src/app/services/connectionsocket-service/connection-socket-io.service';

@Component({
  selector: 'app-online-users',
  templateUrl: './online-users.component.html',
  styleUrls: ['./online-users.component.css']
})
export class OnlineUsersComponent {
  onlineProfiles: Profile[] = [];
  loading: boolean = true;

  constructor(private connectionSocketIO: ConnectionSocketIoService){}
  
  ngOnInit() {
    setTimeout(() => {
      this.connectionSocketIO.onProfileOnline().subscribe((profileOnline : any) => {
        this.onlineProfiles.push(profileOnline);
      });
      this.connectionSocketIO.onProfileOffline().subscribe((profileOffline : any) => {
        this.onlineProfiles = this.onlineProfiles.filter(p => p._id !== profileOffline._id);
      });
      this.connectionSocketIO.getOnlineProfiles().subscribe(profilesList => {
        this.onlineProfiles = profilesList;
        this.loading = false;
      });
    }, 1000);
  }
}