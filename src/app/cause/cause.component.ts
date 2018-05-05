import { NewActionDialog } from "../action/action.component";
import { Component, OnInit, Inject } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { tap, catchError } from "rxjs/operators";
import { of } from "rxjs/observable/of";

@Component({
  selector: "app-cause",
  templateUrl: "./cause.component.html",
  styleUrls: ["./cause.component.css"]
})
export class CauseComponent implements OnInit {
  displayedColumns = [
    "sentiment",
    "name",
    /* "created_by",*/ "created_at",
    "view",
    "delete"
  ];
  causes: any = [];
  data: any = { children: [] };
  name = "";
  sentiment = 0;

  constructor(
    private http: HttpClient,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getCauses();
  }

  getCauses() {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem("jwtToken")
      })
    };
    this.http.get("/api/cause", httpOptions).subscribe(
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

  loadActions(cause) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem('jwtToken')
      })
    };
    this.data.children = [];
    this.http
      .get('/api/cause/' + cause._id + '/actions', httpOptions)
      .subscribe(
        data => {
          this.data = data;
          console.log(data);
        },
        err => {
          if (err.status === 401) {
            this.router.navigate(['login']);
          }
        }
      );
  }

  saveCause(cause) {
    console.log(cause);
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem('jwtToken')
      })
    };
    this.http.post('/api/cause', cause, httpOptions).subscribe(
      data => {
        // this.causes = data;
        console.log(data);
        this.getCauses();
      },
      err => {
        if (err.status === 401) {
          this.router.navigate(['login']);
        }
      }
    );
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(NewCauseDialog, {
      width: '480px',
      data: { name: this.name, sentiment: this.sentiment }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        console.log(result);
        this.saveCause(result);
      }
    });
  }

  openActionDialog(cause): void {
    const dialogRef = this.dialog.open(NewActionDialog, {
      width: '480px',
      data: { name: '', sentiment: 0 }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        console.log(result);
        this.saveAction(result, cause);
      }
    });
  }

  saveAction(action, cause) {
    console.log(action);
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem('jwtToken')
      })
    };
    this.http.post('/api/action/' + cause._id, action, httpOptions).subscribe(
      data => {
        // this.actions = data;
        console.log(data);
        this.loadActions(cause);
      },
      err => {
        if (err.status === 401) {
          this.router.navigate(['login']);
        }
      }
    );
  }

  logout() {
    localStorage.removeItem('jwtToken');
    this.router.navigate(['login']);
  }
  viewCause(cause) {}

  deleteCause(cause) {}
}

@Component({
  selector: 'app-new-cause-dialog',
  templateUrl: 'new-cause-dialog.html',
  styleUrls: ['./cause.component.css']
})
export class NewCauseDialog {
  name: string;
  sentiment: number;
  constructor(
    public dialogRef: MatDialogRef<NewCauseDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
