import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-piece',
  templateUrl: './piece.component.html',
  styleUrls: ['./piece.component.css']
})
export class PieceComponent {
  @Input() color: 'B' | 'W' | null = null; 

  ngOnInit(): void {}
}
