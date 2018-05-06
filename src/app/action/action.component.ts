import { Component, OnInit, Inject } from "@angular/core";
import { DeleteCauseDialog } from "./../cause/cause.component";

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { tap, catchError } from "rxjs/operators";
import { of } from "rxjs/observable/of";
import { ActivatedRoute } from '@angular/router';

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
  query:string = '';
  id:string = '';
  expandedAction: any;
  actions: any = [];
  causes: any = [];
  effects: any = [];
  name: string = "";
  sentiment: number = 0;

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
      this.getActionById(id);
      this.id = id;
    } else if (query) {
      this.searchActions(query);
      this.query = query;
    } else {
      this.getActions();
    }
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
  
  getActionById(actionId) {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem("jwtToken")
      })
    };
    this.http.get("/api/action/" + actionId, httpOptions).subscribe(
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
  
  searchActions(searchQuery) {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem("jwtToken")
      })
    };
    this.http.get("/api/action/search/" + searchQuery, httpOptions).subscribe(
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
  
  doSearch() {
    this.searchActions(this.query);
  }
  resetSearch() {
    this.query = '';
    this.getActions();
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
  
  deleteAction(action) {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem("jwtToken")
      })
    };
    this.http.delete("/api/action/" + action._id, httpOptions).subscribe(
      data => {
        // this.actions = data;
        
        this.getActions();
      },
      err => {
        if (err.status === 401) {
          this.router.navigate(["login"]);
        }
      }
    );
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

  newDialog(): void {
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
  
  deleteDialog(action): void {
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
  deleteCauseDialog(cause): void {
    const dialogRef = this.dialog.open(DeleteCauseDialog, {
      width: "480px",
      data: { cause: cause }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
      if (result) {
        console.log(result);
        this.deleteCause(result.cause);
      }
    });
  }
  deleteCause(cause) {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem("jwtToken")
      })
    };
    this.http.delete("/api/cause/" + cause._id, httpOptions).subscribe(
      data => {
        // this.actions = data;
        
        this.getActions();
      },
      err => {
        if (err.status === 401) {
          this.router.navigate(["login"]);
        }
      }
    );
  }
expandAction(actionId) {
    this.expandedAction = actionId; 
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

@Component({
  selector: "app-delete-action-dialog",
  templateUrl: "delete-action-dialog.html",
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
