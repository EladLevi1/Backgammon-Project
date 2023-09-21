import { Injectable } from "@angular/core";
import GameState from "src/app/models/gameState.model";

@Injectable({
  providedIn: 'root'
})
export class CanvasService {

  canvas: HTMLCanvasElement = document.createElement('canvas');
  ctx: CanvasRenderingContext2D;
  spacing: number = 30;
  triangleBase : number = 0;
  triangleHeight : number = 0;
  selectedTriangle: any = null;

  constructor() {
    this.ctx = this.canvas.getContext('2d')!;
  }

  settingUpService(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d')!;

    canvas.addEventListener('click', (event : MouseEvent) => {
      this.handleCanvasClick(event);
    })
  }

  setUpBoard(gameState: GameState) {
    const triangleBase = (this.canvas.width - 2 * this.spacing) / 13;
    const triangleHeight = (this.canvas.height - 2 * this.spacing) / 2;

    this.triangleBase = triangleBase;
    this.triangleHeight = triangleHeight;

    this.fillBackground();
    this.drawBar(triangleBase);
    this.drawOuterBars();
    this.drawTopAndBottomBars();

    function check(num: number): string {
      return num % 2 === 0 ? '#B58863' : '#8B4513';
    }

    for (let i = 0; i < 13; i++) {
      const color = check(i);

      if (i !== 6){
        this.drawTriangle(i * triangleBase + this.spacing, this.spacing, triangleBase, triangleHeight, 'down', color);
        this.drawTriangle(i * triangleBase + this.spacing, this.spacing + triangleHeight, triangleBase, triangleHeight, 'up', color);

      }
    }

    console.log(gameState.board);

    for (let i = 0; i < 26; i++) {
      const color = gameState.board[i].color!;
      const amount = gameState.board[i].amount!;
      if (i <= 12) {
        this.drawCheckersOnTriangle(12 - i, 'down', color, amount, triangleBase);
      } else {
        this.drawCheckersOnTriangle(i - 13, 'up', color, amount, triangleBase);
      }
      console.log(i, color, amount);
    }
  }

  drawCheckersOnTriangle(triangleNum: number, direction: string, color: string, amount: number, triangleBase: number) {
    const checkerRadius = triangleBase * 0.2;
    const spacingBetweenCheckers = checkerRadius * 2.5;

    for (let i = 0; i < amount; i++) {
      const x = (triangleNum + 0.5) * triangleBase + this.spacing;
      let y;
      if (direction === 'down') {
        y = i * spacingBetweenCheckers + checkerRadius + this.spacing;
      } else {
        y = this.canvas.height - (i * spacingBetweenCheckers + checkerRadius) - this.spacing;
      }

      this.drawChecker(x, y, checkerRadius, color);
    }
  }

  drawTriangle(x: number, y: number, width: number, height: number, direction: string, color: string) {
    this.ctx.beginPath();
    if (direction === 'up') {
      this.ctx.moveTo(x, y + height);
      this.ctx.lineTo(x + width / 2, y);
      this.ctx.lineTo(x + width, y + height);
    } else {
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(x + width / 2, y + height);
      this.ctx.lineTo(x + width, y);
    }
    this.ctx.closePath();
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }

  drawChecker(x: number, y: number, radius: number, color: string) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }

  drawBar(triangleBase: number) {
    const barWidth = triangleBase;
    const barX = this.canvas.width / 2 - barWidth / 2;

    this.ctx.beginPath();
    this.ctx.rect(barX, this.spacing, barWidth, this.canvas.height - 2 * this.spacing);
    this.ctx.fillStyle = '#5c3d24';
    this.ctx.fill();
  }

  drawTopAndBottomBars() {
    this.ctx.beginPath();
    this.ctx.rect(this.spacing, 0, this.canvas.width - 2 * this.spacing, this.spacing);  // Top bar
    this.ctx.rect(this.spacing, this.canvas.height - this.spacing, this.canvas.width - 2 * this.spacing, this.spacing);  // Bottom bar
    this.ctx.fillStyle = '#5c3d24';
    this.ctx.fill();
  }

  drawOuterBars() {
    const outerBarWidth = this.spacing;

    this.ctx.beginPath();
    this.ctx.rect(0, 0, outerBarWidth, this.canvas.height);  // Left outer bar
    this.ctx.rect(this.canvas.width - outerBarWidth, 0, outerBarWidth, this.canvas.height);  // Right outer bar
    this.ctx.fillStyle = '#5c3d24';
    this.ctx.fill();
  }

  fillBackground() {
    this.ctx.fillStyle = '#D2B48C';  // A tan color often seen in backgammon boards. You can adjust as needed.
    this.ctx.fillRect(this.spacing, this.spacing, this.canvas.width - 2 * this.spacing, this.canvas.height - 2 * this.spacing);
  }


  handleCanvasClick(event: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

  }
}
