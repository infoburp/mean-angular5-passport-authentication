import { Component, OnInit, Inject } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "app-new-action-dialog",
  templateUrl: "new-action.dialog.html",
  styleUrls: ["./action.component.css"]
})

export class NewActionDialog {
  name: string;
  sentiment: number;
  constructor(
    public dialogRef: MatDialogRef<NewActionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}