import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Profile from 'src/app/models/profile.model';
import { FriendRequestService } from 'src/app/services/friendrequest-service/friend-request.service';
import { FriendsSocketIoService } from 'src/app/services/friendssocket-service/friends-socket-io.service';
import { ProfileService } from 'src/app/services/profile-service/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  myProfile : Profile = new Profile();
  hisProfile : Profile = new Profile();
  profileFriends : Profile[] = [];

  constructor(private profileService : ProfileService, private route : ActivatedRoute) {}

  ngOnInit() {
    this.profileService.getProfileByToken().subscribe((profile) => {
      this.myProfile = profile;

      this.route.paramMap.subscribe((param) => {
        let id = param.get('id');
  
        this.profileService.getProfileById(id!).subscribe((profile) => {
          this.hisProfile = profile;

          this.profileService.getProfileFriends(this.hisProfile._id).subscribe((friends) => {
            this.profileFriends = friends;
          }); 
        });
      });
    });
  }
}
