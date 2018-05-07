import { Component, OnInit, Inject } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "app-edit-action-dialog",
  templateUrl: "edit-action.dialog.html",
  styleUrls: ["./action.component.css"]
})

export class EditActionDialog {
  name: string;
  sentiment: number;
  constructor(
    public dialogRef: MatDialogRef<EditActionDialog>,
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