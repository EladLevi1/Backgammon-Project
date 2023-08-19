import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import Profile from 'src/app/models/profile.model';
import { ConnectionSocketIoService } from 'src/app/services/connectionsocket-service/connection-socket-io.service';

@Component({
  selector: 'app-online-users',
  templateUrl: './online-users.component.html',
  styleUrls: ['./online-users.component.css']
})
export class OnlineUsersComponent {
  // private destroy$ = new Subject<void>();

  onlineProfiles: Profile[] = [];

  constructor(private connectionSocketIO: ConnectionSocketIoService){}
  ngOnInit() {
    this.connectionSocketIO.getOnlineProfiles().subscribe(profilesList => {
      this.onlineProfiles = profilesList;
    });

      //   this.connectionSocketIO.getOnlineProfiles().pipe(takeUntil(this.destroy$)).subscribe(profilesList => {
  //     this.onlineProfiles = profilesList;
  //     console.log(profilesList);
  //   });

    this.connectionSocketIO.onProfileOnline().subscribe((profileOnline : any) => {
      this.onlineProfiles.push(profileOnline);
    });

    this.connectionSocketIO.onProfileOffline().subscribe((profileOffline : any) => {
      this.onlineProfiles = this.onlineProfiles.filter(p => p._id !== profileOffline._id);
    });
  }

  // ngOnDestroy() {
  //   this.destroy$.next();
  //   this.destroy$.complete();
  // }
}
