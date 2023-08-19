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

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [LogRegGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [LogRegGuard] },
  { path: 'play', component: PlayComponent, canActivate: [AuthGuard] },
  { path: 'friends', component: FriendsComponent, canActivate: [AuthGuard] },
  { path: 'about', component: AboutComponent, canActivate: [AuthGuard] },
  { path: 'howtoplay', component: HowToPlayComponent, canActivate: [AuthGuard] }, 
  { path: 'onlineplayers', component: OnlineUsersComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule{}