import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-waiting-for-opponent',
  templateUrl: './waiting-for-opponent.component.html',
  styleUrls: ['./waiting-for-opponent.component.css']
})
export class WaitingForOpponentComponent {
  public nickname: string;

  constructor(
    public dialogRef: MatDialogRef<WaitingForOpponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.nickname = data.nickname;
  }
}
