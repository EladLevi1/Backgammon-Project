import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RandomPlayComponent } from './components/random-play/random-play.component';
import { PlayWithFriendComponent } from './components/play-with-friend/play-with-friend.component';
import { GameComponent } from './components/game/game.component';
import { OnlineUsersComponent } from './components/online-users/online-users.component';
import { PlayComponent } from './components/play/play.component';
import { FriendsComponent } from './components/friends/friends.component';
import { AboutComponent } from './components/about/about.component';
import { HowToPlayComponent } from './components/how-to-play/how-to-play.component';
import { GlobalChatComponent } from './components/global-chat/global-chat.component';
import { PrivateChatComponent } from './components/private-chat/private-chat.component';
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { JoinGameDialogComponent } from './components/join-game-dialog/join-game-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { WaitingForOpponentComponent } from './components/waiting-for-opponent/waiting-for-opponent.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    RandomPlayComponent,
    PlayWithFriendComponent,
    GameComponent,
    OnlineUsersComponent,
    PlayComponent,
    FriendsComponent,
    AboutComponent,
    HowToPlayComponent,
    GlobalChatComponent,
    PrivateChatComponent,
    NotificationsComponent,
    LeaderboardComponent,
    ProfileComponent,
    JoinGameDialogComponent,
    WaitingForOpponentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
