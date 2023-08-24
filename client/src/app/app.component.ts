import { Component } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { UserService } from './services/user-service/user.service';
import { ConnectionSocketIoService } from './services/connectionsocket-service/connection-socket-io.service';
import User from './models/user.model';
import { ProfileService } from './services/profile-service/profile.service';
import Profile from './models/profile.model';
import { Router } from '@angular/router';
import { GameInvitationSocketIoService } from './services/gameinvitationsocket-service/game-invitation-socket-io.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  user: User = new User();
  profile: Profile = new Profile();
  showProfileMenu = false;
  ismenurequired: boolean = false;
  globalChat : boolean = false;
  notifications: boolean = false;
  isChatRoute: boolean = false;
  
  constructor(private userService: UserService, private connectionSocketIO: ConnectionSocketIoService,
    private profileService: ProfileService, private router: Router){}

  ngOnInit() {
    const token = this.userService.getToken();
  
    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.userService.getUserById(decodedToken._id).subscribe((u) => {
        this.user = u;
    
        this.profileService.getProfileByUserId(this.user._id).subscribe((p) => {
          this.profile = p;
    
          this.connectionSocketIO.profileConnected(this.profile._id);
        }, (error) => {
          console.log(error.error);
        });
      }, (error) => {
        console.log(error.error);
      });
    }
  }

  ngDoCheck() {
    const currentURL = this.router.url;
    const isPrivateChatPath = currentURL.startsWith('/privatechat/');

    if (this.userService.getToken() != null && !isPrivateChatPath) {
        this.ismenurequired = true;
    } else {
        this.ismenurequired = false;
    }
}
  
  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  logout() {
    localStorage.removeItem("token");
    window.location.reload();
  }

  handleCloseChat() {
    this.globalChat = false;
  }
}