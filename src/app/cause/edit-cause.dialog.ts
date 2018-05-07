import { Component, OnInit, Inject } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "app-edit-cause-dialog",
  templateUrl: "edit-cause.dialog.html",
  styleUrls: ["./cause.component.css"]
})

export class EditCauseDialog {
  name: string;
  sentiment: number;
  constructor(
    public dialogRef: MatDialogRef<EditCauseDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  submit() {
    document.getElementById('submitButton').click()
  }
  
  up() {
    if (this.data.sentiment < 1) {
      this.data.sentiment++;
      console.log('up')
    }
  }
  
  down() {
    if (this.data.sentiment > -1) {
      this.data.sentiment--;
      console.log('down')
    }
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }
}