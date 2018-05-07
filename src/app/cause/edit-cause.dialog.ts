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

  onNoClick(): void {
    this.dialogRef.close();
  }
}