import { Component, OnInit, Inject } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { tap, catchError } from "rxjs/operators";
import { of } from "rxjs/observable/of";

@Component({
  selector: "app-action",
  templateUrl: "./action.component.html",
  styleUrls: ["./action.component.css"]
})
export class ActionComponent implements OnInit {
  displayedColumns = [
    "sentiment",
    "name",
    /*'created_by',*/ "created_at",
    "view",
    "delete"
  ];
  actions: any = [];
  causes: any = [];
  effects: any = [];
  name: string = "";
  sentiment: number = 0;

  constructor(
    private http: HttpClient,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getActions();
  }

  getActions() {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem("jwtToken")
      })
    };
    this.http.get("/api/action", httpOptions).subscribe(
      data => {
        this.actions = data;
        console.log(this.actions);
      },
      err => {
        if (err.status === 401) {
          this.router.navigate(["login"]);
        }
      }
    );
  }

  loadDetails(action) {
    console.log(action);
    this.loadCauses(action);
    this.loadEffects(action);
  }

  loadCauses(action) {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem("jwtToken")
      })
    };
    this.causes = null;
    this.http
      .get("/api/action/" + action._id + "/causes", httpOptions)
      .subscribe(
        data => {
          this.causes = data;
          console.log(this.causes);
        },
        err => {
          if (err.status === 401) {
            this.router.navigate(["login"]);
          }
        }
      );
  }

  loadEffects(action) {
    /*let httpOptions = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem("jwtToken")
      })
    };
    this.effects = null;
    this.http
      .get("/api/action/" + action._id + "/effects", httpOptions)
      .subscribe(
        data => {
          this.effects = data;
          console.log(this.effects);
        },
        err => {
          if (err.status === 401) {
            this.router.navigate(["login"]);
          }
        }
      );*/
  }

  saveAction(action) {
    console.log(action);
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem("jwtToken")
      })
    };
    this.http.post("/api/action", action, httpOptions).subscribe(
      data => {
        // this.actions = data;
        console.log(data);
        this.getActions();
      },
      err => {
        if (err.status === 401) {
          this.router.navigate(["login"]);
        }
      }
    );
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(NewActionDialog, {
      width: "480px",
      data: { name: this.name, sentiment: this.sentiment }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
      if (result) {
        console.log(result);
        this.saveAction(result);
      }
    });
  }

  logout() {
    localStorage.removeItem("jwtToken");
    this.router.navigate(["login"]);
  }
}

@Component({
  selector: "app-new-action-dialog",
  templateUrl: "new-action-dialog.html",
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
