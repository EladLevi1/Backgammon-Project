import { Component } from '@angular/core';
import Profile from 'src/app/models/profile.model';
import { ProfileService } from 'src/app/services/profile-service/profile.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent {

  profiles : Profile[] = [];
  loading: boolean = true;

  constructor(private profileService: ProfileService){}

  ngOnInit() {
    this.profileService.getProfiles().subscribe((profiles) => {
      this.profiles = profiles;
      
      this.loading = false;
    },
    (error) => {
      console.log(error.error)
    });
  }
}
