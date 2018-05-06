import { Component, OnInit, Inject } from "@angular/core";
import { DeleteCauseDialog } from "./../cause/delete-cause.dialog";
import { NewActionDialog } from "./new-action.dialog";
import { DeleteActionDialog } from "./delete-action.dialog";

import { Action } from "../_models/action.model";
import { Cause } from "../_models/cause.model";
import { Effect } from "../_models/effect.model";
import { ActionService } from "../_services/action.service";
import { CauseService } from "../_services/cause.service";
import { EffectService } from "../_services/effect.service";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
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

  query:string = '';
  id:string = '';
  expandedAction: string;
  actions: Action[] = [];
  name: string = "";
  sentiment: number = 0;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private effectService: EffectService,
    private causeService: CauseService,
    private actionService: ActionService
  ) {}

  ngOnInit() {
    let id: string = this.route.snapshot.paramMap.get('id');
    let query: string = this.route.snapshot.paramMap.get('query');
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
    this.actionService.getActionList().subscribe(
      data => {
        this.actions = data;
      },
      err => {
        if (err.status === 401) {
          this.router.navigate(["login"]);
        }
      }
    );
  }
  
  getActionById(actionId: string) {
    this.actionService.getAction(actionId).subscribe(
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
  
  searchActions(searchQuery: string) {
    this.actionService.searchAction(searchQuery).subscribe(
      data => {
        this.actions = data;
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
  
  deleteAction(actionId: string) {
    this.actionService.deleteAction(actionId).subscribe(
      data => {
        this.getActions();
      },
      err => {
        if (err.status === 401) {
          this.router.navigate(["login"]);
        }
      }
    );
  }

  saveAction(action: Action, causeId: string) {
    this.actionService.saveAction(action, causeId).subscribe(
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
  
  deleteDialog(action: Action): void {
    const dialogRef = this.dialog.open(DeleteActionDialog, {
      width: "480px",
      data: { action: action }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
      if (result) {
        console.log(result);
        this.deleteAction(result.action._id);
      }
    });
  }
  deleteCauseDialog(cause: Cause): void {
    const dialogRef = this.dialog.open(DeleteCauseDialog, {
      width: "480px",
      data: { cause: cause }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
      if (result) {
        console.log(result);
        this.deleteCause(result.cause._id);
      }
    });
  }
  deleteCause(causeId: string) {
    this.causeService.deleteCause(causeId).subscribe(
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


