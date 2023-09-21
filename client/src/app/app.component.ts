import { Component } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { UserService } from './services/user-service/user.service';
import { ConnectionSocketIoService } from './services/connectionsocket-service/connection-socket-io.service';
import User from './models/user.model';
import { ProfileService } from './services/profile-service/profile.service';
import Profile from './models/profile.model';
import { Router } from '@angular/router';
import { NotificationService } from './services/notification-service/notification.service';
import { NotificationSocketIoService } from './services/notificationsocket-service/notification-socket-io.service';
import Notification from './models/notification.model';
import { MatSnackBarService } from './services/matSnackBar-service/mat-snack-bar.service';
import { GameInvitationSocketIoService } from './services/gameinvitationsocket-service/game-invitation-socket-io.service';
import { JoinGameDialogComponent } from './components/join-game-dialog/join-game-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { GameService } from './services/game-service/game.service';
import Game from './models/game.model';
import { GameStateService } from './services/gamestate-service/game-state.service';
import GameState from './models/gameState.model';

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
  isChatRoute: boolean = false;
  notifications: Notification[] = [];
  allRead : boolean = true;
  
  constructor(private userService: UserService, private connectionSocketIO: ConnectionSocketIoService,
    private profileService: ProfileService, private router: Router, private notificationService : NotificationService,
    private notificationSocketIO: NotificationSocketIoService, private matSnackBarService : MatSnackBarService,
    private gameInvitationSocketIO : GameInvitationSocketIoService, private dialog : MatDialog,
    private gameService: GameService, private gameStateService: GameStateService){}

  ngOnInit() {
    const token = this.userService.getToken();
  
    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.userService.getUserById(decodedToken._id).subscribe((u) => {
        this.user = u;
    
        this.profileService.getProfileByUserId(this.user._id).subscribe((p) => {
          this.profile = p;
    
          this.connectionSocketIO.profileConnected(this.profile._id);

          this.notificationService.getNotificationsForProfile(this.profile._id).subscribe((notifications) => {
            this.notifications = notifications;

            this.checkForUnreadNotifications();
          },
          (error) => {
            console.log(error.error);
          })
        }, (error) => {
          console.log(error.error);
        });
      }, (error) => {
        console.log(error.error);
      });

      this.notificationSocketIO.onNewNotification().subscribe((notification) => {
        this.notifications.push(notification);

        this.allRead = false;

        this.matSnackBarService.recieveNotification(notification.content);
      },
      (error) => {
        console.log(error.error);
      })

      this.notificationSocketIO.onDeleteNotification().subscribe((notification) => {
        this.notifications = this.notifications.filter(n => n._id !== notification._id);
        this.checkForUnreadNotifications();
      },
      (error) => {
        console.log(error.error)
      });

      this.notificationSocketIO.onMarkedNotification().subscribe((notification: any) => {
        const targetNotification = this.notifications.find(n => n._id === notification._id);
        if (targetNotification) {
          targetNotification.status = 'read';
          this.checkForUnreadNotifications();
        }
      }, 
      (error) => {
        console.log(error);
      }); 
      
      this.gameInvitationSocketIO.onGameInvitationAccepted().subscribe((inv) => {
        const dialogRef = this.dialog.open(JoinGameDialogComponent, {
          data: {
            nickname: inv.sender.nickname
          }
        });
        
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            let game = new Game();
            game.players.white = this.profile;
            this.profileService.getProfileById(inv.recipient._id).subscribe((p) => {
              game.players.black = p;

              this.gameService.createGame(game).subscribe((game) => {
                let gameState = new GameState();
                gameState.game = game;
                gameState.currentPlayer = 'white';
                
                this.gameStateService.createGameState(gameState).subscribe(() => {
                  this.router.navigate(['/game', game._id]);
                });
              },
              (error) => {
                console.log(error.error)
              })
            })
          } else {
            console.log(false, result);
          }
        });
      },
      (error) => {
        console.log(error.error);
      })
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

  checkForUnreadNotifications() {
    if (this.notifications.some(n => n.status === 'unread')){
      this.allRead = false;
    } else {
      this.allRead = true;
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