import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-join-game-dialog',
  templateUrl: './join-game-dialog.component.html',
  styleUrls: ['./join-game-dialog.component.css']
})
export class JoinGameDialogComponent {
  public nickname: string;

  constructor(
    public dialogRef: MatDialogRef<JoinGameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.nickname = data.nickname;
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
