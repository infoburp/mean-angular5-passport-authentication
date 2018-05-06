import { Component, OnInit, Inject } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "app-delete-cause-dialog",
  templateUrl: "delete-cause.dialog.html",
  styleUrls: ["./cause.component.css"]
})

export class DeleteCauseDialog {
  constructor(
    public dialogRef: MatDialogRef<DeleteCauseDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}