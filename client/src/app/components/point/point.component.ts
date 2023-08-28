import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-point',
  templateUrl: './point.component.html',
  styleUrls: ['./point.component.css']
})
export class PointComponent {
  @Input() pieces: ('B' | 'W')[] = [];
  @Input() invertDirection = false;

  ngOnInit(): void {
    if (this.pieces.length > 0) {
      this.invertDirection = this.pieces[0] === 'B';
    }
  }
}
