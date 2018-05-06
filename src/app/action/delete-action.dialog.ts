import { Component, OnInit, Inject } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "app-delete-action-dialog",
  templateUrl: "delete-action.dialog.html",
  styleUrls: ["./action.component.css"]
})

export class DeleteActionDialog {
  constructor(
    public dialogRef: MatDialogRef<DeleteActionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}