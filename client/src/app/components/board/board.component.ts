import { Component } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent {
  boardState: ('B' | 'W')[][] = [
    ['B', 'B'],               // Point 1
    [],                       // Point 2
    [],                       // Point 3
    [],                       // Point 4
    ['W', 'W', 'W', 'W', 'W'], // Point 5
    [],                       // Point 6
    ['W', 'W', 'W'],          // Point 7
    [],                       // Point 8
    [],                       // Point 9
    [],                       // Point 10
    ['B', 'B', 'B', 'B', 'B'], // Point 11
    ['B', 'B', 'B'],          // Point 12
    ['W', 'W', 'W'],          // Point 13
    ['W', 'W', 'W', 'W', 'W'], // Point 14
    [],                       // Point 15
    [],                       // Point 16
    [],                       // Point 17
    ['B', 'B', 'B'],          // Point 18
    [],                       // Point 19
    ['B', 'B', 'B', 'B', 'B'], // Point 20
    [],                       // Point 21
    [],                       // Point 22
    [],                       // Point 23
    ['W', 'W']                // Point 24
  ];

  ngOnInit(): void {}
}
