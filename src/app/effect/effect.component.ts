import { NewCauseDialog } from "./../cause/cause.component";
import { DeleteCauseDialog } from "./../cause/cause.component";
import { NewActionDialog } from "./../action/action.component";
import { DeleteActionDialog } from "./../action/action.component";
import { Component, OnInit, Inject } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { tap, catchError } from "rxjs/operators";
import { of } from "rxjs/observable/of";
import { ActivatedRoute } from '@angular/router';

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
  query:string = '';
  id:string = '';
  expandedEffect: any;
  effects: any = [];
  data: any = { children: [] };
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
      this.getEffectById(id);
      this.id = id;
    } else if (query) {
      this.searchEffects(query);
      this.query = query;
    } else {
      this.getEffects();
    }
    
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
  
  getEffectById(effectId) {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem("jwtToken")
      })
    };
    this.http.get("/api/effect/" + effectId, httpOptions).subscribe(
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
  
  searchEffects(searchQuery) {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem("jwtToken")
      })
    };
    this.http.get("/api/effect/search/" + searchQuery, httpOptions).subscribe(
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
  
  doSearch() {
    this.searchEffects(this.query);
  }
  resetSearch() {
    this.query = '';
    this.getEffects();
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
  expandEffect(effectId) {
    this.expandedEffect = effectId; console.log(this.expandedEffect)
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
        
        this.getEffects();
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

  deleteEffect(effect) {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem("jwtToken")
      })
    };
    this.http.delete("/api/effect/" + effect._id, httpOptions).subscribe(
      data => {
        // this.actions = data;
        
        this.getEffects();
      },
      err => {
        if (err.status === 401) {
          this.router.navigate(["login"]);
        }
      }
    );
  }

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
  
  deleteDialog(effect): void {
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
  deleteAction(action) {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem("jwtToken")
      })
    };
    this.http.delete("/api/action/" + action._id, httpOptions).subscribe(
      data => {
        // this.actions = data;
        
        this.getEffects();
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
        this.getEffects();
      }
    });
    
    event.stopPropagation();
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
        this.getEffects();
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
@Component({
  selector: "app-delete-effect-dialog",
  templateUrl: "delete-effect-dialog.html",
  styleUrls: ["./effect.component.css"]
})
export class DeleteEffectDialog {
  constructor(
    public dialogRef: MatDialogRef<DeleteEffectDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}