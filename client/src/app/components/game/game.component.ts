import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import GameState from 'src/app/models/gameState.model';
import Profile from 'src/app/models/profile.model';
import { CanvasService } from 'src/app/services/canvas-service/canvas.service';
import { GameService } from 'src/app/services/game-service/game.service';
import { GameStateService } from 'src/app/services/gamestate-service/game-state.service';
import { ProfileService } from 'src/app/services/profile-service/profile.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent {
  @ViewChild('gameCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  gameState: GameState = new GameState();

  myProfile: Profile = new Profile();
  hisProfile: Profile = new Profile();


  constructor(private canvasService: CanvasService, private gameStateService : GameStateService, private route : ActivatedRoute,
    private profileService: ProfileService, private gameService : GameService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;

    this.profileService.getProfileByToken().subscribe((p) => {
      this.myProfile = p;
    },
    (error) => {
      console.log(error.error)
    });

    this.gameService.getGame(id).subscribe((game) => {
      this.gameStateService.getGameStateByGameId(game._id).subscribe((gameState) => {
        this.gameState = gameState;
        console.log(this.gameState);
        this.canvasService.settingUpService(this.canvasRef.nativeElement);
        this.canvasService.setUpBoard(this.gameState);
      },
      (error) => {
        console.log(error.error)
      });
    },
    (error) => {
      console.log(error.error)
    });
  }

  selectChecker(){
    this.canvasRef.nativeElement
  }
}