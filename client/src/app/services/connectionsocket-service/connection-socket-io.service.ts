import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable, forkJoin } from 'rxjs';
import Profile from 'src/app/models/profile.model';
import { ProfileService } from '../profile-service/profile.service';

@Injectable({
  providedIn: 'root'
})
export class ConnectionSocketIoService {
  private socket;

  constructor(private profileService: ProfileService) {
    this.socket = io('http://localhost:8080');
  }

  public profileConnected(profileId: string): void {
    this.socket.emit('profileConnected', profileId);
  }

  public onProfileOnline(): Observable<Profile> {
    return new Observable<Profile>(observer => {
      this.socket.on('profileOnline', (profileId: string) => {
        this.profileService.getProfileById(profileId).subscribe(profile => {
          observer.next(profile);
        });
      });
    });
  }

  public onProfileOffline(): Observable<Profile> {
    return new Observable<Profile>(observer => {
      this.socket.on('profileOffline', (profileId: string) => {
        if (profileId !== null){
          this.profileService.getProfileById(profileId).subscribe(profile => {
            observer.next(profile);
          },
          (error) => {
            console.log(error.error)
          });
        }
      });
    });
  }

  public getOnlineProfiles(): Observable<Profile[]> {
    return new Observable<Profile[]>(observer => {
      this.socket.emit('getOnlineProfiles');
      this.socket.off('onlineProfilesList');
      this.socket.on('onlineProfilesList', (profilesIdList: string[]) => {
        const profilesObservables = profilesIdList.map(id => this.profileService.getProfileById(id));
        forkJoin(profilesObservables).subscribe(profiles => {
          observer.next(profiles);
        });
      });
    });
  }  
}
