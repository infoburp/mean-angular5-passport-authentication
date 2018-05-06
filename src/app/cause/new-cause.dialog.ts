import { Component, OnInit, Inject } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: 'app-new-cause-dialog',
  templateUrl: 'new-cause.dialog.html',
  styleUrls: ['./cause.component.css']
})

export class NewCauseDialog {
  name: string;
  sentiment: number;
  constructor(
    public dialogRef: MatDialogRef<NewCauseDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}