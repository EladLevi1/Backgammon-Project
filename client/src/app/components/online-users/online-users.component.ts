import { Component } from '@angular/core';
import Profile from 'src/app/models/profile.model';
import { ConnectionSocketIoService } from 'src/app/services/connectionsocket-service/connection-socket-io.service';
import { ProfileService } from 'src/app/services/profile-service/profile.service';

@Component({
  selector: 'app-online-users',
  templateUrl: './online-users.component.html',
  styleUrls: ['./online-users.component.css']
})
export class OnlineUsersComponent {
  onlineProfiles: Profile[] = [];
  loading: boolean = true;
  profile: Profile = new Profile();

  constructor(private connectionSocketIO: ConnectionSocketIoService, private profileService: ProfileService){}
  
  ngOnInit() {
    this.profileService.getProfileByToken().subscribe((p) => {
      this.profile = p;

      this.connectionSocketIO.onProfileOnline().subscribe((profileOnline : any) => {
        if (profileOnline._id !== this.profile._id){
          this.onlineProfiles.push(profileOnline);
        }
      });
      this.connectionSocketIO.onProfileOffline().subscribe((profileOffline : any) => {
        this.onlineProfiles = this.onlineProfiles.filter(p => p._id !== profileOffline._id);
      });
      this.connectionSocketIO.getOnlineProfiles().subscribe(profilesList => {
        this.onlineProfiles = profilesList.filter(p => p._id !== this.profile._id);
        this.loading = false;
      }); 
    });
  }

  // isFriend(profile : Profile) : boolean{
  //   console.log(this.onlineProfiles.length)
  //   console.log(this.profile.friends.some(p => p._id === profile._id))
  //   return this.profile.friends.some(p => p._id === profile._id);
  // }
}
