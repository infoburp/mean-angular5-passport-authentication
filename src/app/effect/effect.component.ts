import { NewCauseDialog } from "./../cause/cause.component";
import { Component, OnInit, Inject } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { tap, catchError } from "rxjs/operators";
import { of } from "rxjs/observable/of";

@Component({
  selector: "app-effect",
  templateUrl: "./effect.component.html",
  styleUrls: ["./effect.component.css"]
})
export class EffectComponent implements OnInit {
  displayedColumns = [
    "sentiment",
    "name",
    /*"created_by",*/
    "created_at",
    "view",
    "delete"
  ];
  effects: any = [];
  data: any = { children: [] };
  name: string = "";
  sentiment: number = 0;

  constructor(
    private http: HttpClient,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getEffects();
  }

  getEffects() {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem("jwtToken")
      })
    };
    this.http.get("/api/effect", httpOptions).subscribe(
      data => {
        this.effects = data;
        console.log(this.effects);
      },
      err => {
        if (err.status === 401) {
          this.router.navigate(["login"]);
        }
      }
    );
  }

  saveEffect(effect) {
    console.log(effect);
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem("jwtToken")
      })
    };
    this.http.post("/api/effect", effect, httpOptions).subscribe(
      data => {
        // this.effects = data;
        console.log(data);
        this.getEffects();
      },
      err => {
        if (err.status === 401) {
          this.router.navigate(["login"]);
        }
      }
    );
  }

  viewEffect(effect) {}

  deleteEffect(effect) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(NewEffectDialog, {
      width: "480px",
      data: { name: this.name, sentiment: this.sentiment }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
      if (result) {
        console.log(result);
        this.saveEffect(result);
      }
    });
  }

  loadCauses(effect) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem("jwtToken")
      })
    };
    this.data.children = [];
    this.http
      .get("/api/effect/" + effect._id + "/causes", httpOptions)
      .subscribe(
        data => {
          this.data = data;
          console.log(data);
        },
        err => {
          if (err.status === 401) {
            this.router.navigate(["login"]);
          }
        }
      );
  }

  openCauseDialog(effect): void {
    const dialogRef = this.dialog.open(NewCauseDialog, {
      width: "480px",
      data: { name: "", sentiment: 0 }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
      if (result) {
        console.log(result);
        this.saveCause(result, effect);
      }
    });
  }

  saveCause(cause, effect) {
    console.log(cause);
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem("jwtToken")
      })
    };
    this.http.post("/api/cause/" + effect._id, cause, httpOptions).subscribe(
      data => {
        // this.actions = data;
        console.log(data);
        this.loadCauses(effect);
      },
      err => {
        if (err.status === 401) {
          this.router.navigate(["login"]);
        }
      }
    );
  }

  logout() {
    localStorage.removeItem("jwtToken");
    this.router.navigate(["login"]);
  }
}

@Component({
  selector: "app-new-effect-dialog",
  templateUrl: "new-effect-dialog.html",
  styleUrls: ["./effect.component.css"]
})
export class NewEffectDialog {
  name: string;
  sentiment: number;
  constructor(
    public dialogRef: MatDialogRef<NewEffectDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
