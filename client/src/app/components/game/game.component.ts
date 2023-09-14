import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import Triangle from 'src/app/models/stack.model';
import { CanvasService } from 'src/app/services/canvas-service/canvas.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent {
  @ViewChild('gameCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
    
  constructor(private canvasService: CanvasService) {}

  ngOnInit() {
    this.canvasService.settingUpService(this.canvasRef.nativeElement);
    this.canvasService.setUpBoard();
  }

  selectChecker(){
    this.canvasRef.nativeElement
  }
}