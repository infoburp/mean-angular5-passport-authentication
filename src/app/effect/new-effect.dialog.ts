import { Component, OnInit, Inject } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "app-new-effect-dialog",
  templateUrl: "new-effect.dialog.html",
  styleUrls: ["./effect.component.css"]
})

export class NewEffectDialog {
  name: string;
  sentiment: number;
  constructor(
    public dialogRef: MatDialogRef<NewEffectDialog>,
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