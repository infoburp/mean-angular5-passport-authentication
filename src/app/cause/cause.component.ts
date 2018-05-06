import { NewActionDialog } from "../action/action.component";
import { DeleteActionDialog } from "../action/action.component";
import { DeleteEffectDialog } from "../effect/effect.component";

import { Component, OnInit, Inject } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { tap, catchError } from "rxjs/operators";
import { of } from "rxjs/observable/of";
import { ActivatedRoute } from '@angular/router';

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
  query:string = '';
  id:string = '';
  expandedCause: any;
  causes: any = [];
  data: any = { children: [] };
  name = "";
  sentiment = 0;

  constructor(
    private http: HttpClient,
    private router: Router,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    let query = this.route.snapshot.paramMap.get('query');
    if (id) {
      this.getCauseById(id);
      this.id = id;
    } else if (query) {
      this.searchCauses(query);
      this.query = query;
    } else {
      this.getCauses();
    }
   
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

getCauseById(causeId) {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem("jwtToken")
      })
    };
    this.http.get("/api/cause/" + causeId, httpOptions).subscribe(
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
  
  searchCauses(searchQuery) {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem("jwtToken")
      })
    };
    this.http.get("/api/cause/search/" + searchQuery, httpOptions).subscribe(
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
  
  doSearch() {
    this.searchCauses(this.query);
  }
  resetSearch() {
    this.query = '';
    this.getCauses();
  }
  queryChanged(event) {
    if(event.keyCode == 13){
      if (this.query != '') {
        this.doSearch();
      } else {
        this.resetSearch();
      }
   }else{
     if (this.query.length <= 1 && event.keyCode == 8) {
        this.resetSearch();
      }
   }
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
        this.getCauses();
      }
    });
  }
  
  deleteDialog(cause): void {
    const dialogRef = this.dialog.open(DeleteCauseDialog, {
      width: "480px",
      data: { cause: cause }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
      if (result) {
        console.log(result);
        this.deleteCause(result.cause);
        this.getCauses();
      }
    });
  }
  deleteEffectDialog(effect): void {
    const dialogRef = this.dialog.open(DeleteEffectDialog, {
      width: "480px",
      data: { effect: effect }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
      if (result) {
        console.log(result);
        this.deleteEffect(result.effect);
        
      }
    });
  }
  deleteEffect(effect) {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem("jwtToken")
      })
    };
    this.http.delete("/api/effect/" + effect._id, httpOptions).subscribe(
      data => {
        // this.actions = data;
        
        this.getCauses();
      },
      err => {
        if (err.status === 401) {
          this.router.navigate(["login"]);
        }
      }
    );
  }
  
  deleteAction(action) {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem("jwtToken")
      })
    };
    this.http.delete("/api/action/" + action._id, httpOptions).subscribe(
      data => {
        // this.actions = data;
        
        this.getCauses();
      },
      err => {
        if (err.status === 401) {
          this.router.navigate(["login"]);
        }
      }
    );
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
        this.getCauses();
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
        this.getCauses();
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
  deleteActionDialog(action): void {
    const dialogRef = this.dialog.open(DeleteActionDialog, {
      width: "480px",
      data: { action: action }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
      if (result) {
        console.log(result);
        this.deleteAction(result.action);
      }
    });
  }
  viewCause(cause) {}

  deleteCause(cause) {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem("jwtToken")
      })
    };
    this.http.delete("/api/cause/" + cause._id, httpOptions).subscribe(
      data => {
        // this.actions = data;
        
        this.getCauses();
      },
      err => {
        if (err.status === 401) {
          this.router.navigate(["login"]);
        }
      }
    );
  }
  expandCause(causeId) {
    this.expandedCause = causeId; 
  }
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

@Component({
  selector: "app-delete-cause-dialog",
  templateUrl: "delete-cause-dialog.html",
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