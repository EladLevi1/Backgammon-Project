import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { PlayComponent } from './components/play/play.component';
import { FriendsComponent } from './components/friends/friends.component';
import { AboutComponent } from './components/about/about.component';
import { AuthGuard } from './guards/authguard.guard';
import { HowToPlayComponent } from './components/how-to-play/how-to-play.component';
import { LogRegGuard } from './guards/logreg.guard';
import { OnlineUsersComponent } from './components/online-users/online-users.component';
import { PrivateChatComponent } from './components/private-chat/private-chat.component';
import { PlayWithFriendComponent } from './components/play-with-friend/play-with-friend.component';
import { GameComponent } from './components/game/game.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { ProfileComponent } from './components/profile/profile.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [LogRegGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [LogRegGuard] },
  { path: 'play', component: PlayComponent, canActivate: [AuthGuard] },
  { path: 'friends', component: FriendsComponent, canActivate: [AuthGuard] },
  { path: 'about', component: AboutComponent, canActivate: [AuthGuard] },
  { path: 'howtoplay', component: HowToPlayComponent, canActivate: [AuthGuard] }, 
  { path: 'onlineplayers', component: OnlineUsersComponent, canActivate: [AuthGuard] },
  { path: 'privatechat/:id', component: PrivateChatComponent, canActivate: [AuthGuard] },
  { path: 'playfriend', component: PlayWithFriendComponent, canActivate: [AuthGuard] },
  { path: 'game', component: GameComponent, canActivate: [AuthGuard] },
  { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard] },
  { path: 'leaderboard', component: LeaderboardComponent, canActivate: [AuthGuard] },
  { path: 'profile/:id', component: ProfileComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule{}