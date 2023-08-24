import { Injectable } from '@angular/core';
import { Observable, Observer, forkJoin, map } from 'rxjs';
import Profile from 'src/app/models/profile.model';
import { ProfileService } from '../profile-service/profile.service';
import { PublicSocketIoService } from '../publicsocket-service/public-socket-io.service';

@Injectable({
  providedIn: 'root'
})
export class ConnectionSocketIoService {
  private socket;

  constructor(private profileService: ProfileService, private publicSocketIO: PublicSocketIoService) {
    this.socket = this.publicSocketIO.getSocket();
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

  public getOnlineProfiles(): Observable<any[]> {
    return new Observable((observer: Observer<any[]>) => {
      this.socket.emit('getOnlineProfiles');
      this.socket.on('onlineProfilesList', (profilesIdList: string[]) => {
        const profilesObservables = profilesIdList.map(id => this.profileService.getProfileById(id));
        forkJoin(profilesObservables).subscribe(profiles => {
          observer.next(profiles);
        });
      });
    });
  }
}
