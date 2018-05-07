import { Component, OnInit, Inject } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "app-delete-effect-dialog",
  templateUrl: "delete-effect.dialog.html",
  styleUrls: ["./effect.component.css"]
})

export class DeleteEffectDialog {
  constructor(
    public dialogRef: MatDialogRef<DeleteEffectDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  
  submit() {
    document.getElementById('submitButton').click()
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }
}