import { Component, OnInit, Inject } from "@angular/core";

import { NewActionDialog } from "./new-action.dialog";
import { EditActionDialog } from "./edit-action.dialog";
import { DeleteActionDialog } from "./delete-action.dialog";

import { NewCauseDialog } from "./../cause/new-cause.dialog";
import { EditCauseDialog } from "./../cause/edit-cause.dialog";
import { DeleteCauseDialog } from "./../cause/delete-cause.dialog";

import { NewEffectDialog } from "./../effect/new-effect.dialog";
import { EditEffectDialog } from "./../effect/edit-effect.dialog";
import { DeleteEffectDialog } from "./../effect/delete-effect.dialog";

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
import {BrowserModule} from '@angular/platform-browser'
import { animate, state, style, transition, trigger } from '@angular/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SlideInOutAnimation } from '../_animations/slide-in-out.animation';
import { FadeInOutAnimation } from '../_animations/fade-in-out.animation';

@Component({
  selector: "app-action",
  templateUrl: "./action.component.html",
  styleUrls: ["./action.component.css"],
  // make slide in/out animation available to this component
    animations: [SlideInOutAnimation,FadeInOutAnimation],
})
export class ActionComponent implements OnInit {

  query:string = '';
  id:string = '';
  expandedAction: string;
  actions: Action[] = [];
  name: string = "";
  sentiment: number = 0;
  initialGet = false;
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
      this.getAction(id);
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
        this.initialGet = true;
      },
      err => {
        if (err.status === 401) {
          this.router.navigate(["login"]);
        }
      }
    );
  }
  
  getAction(actionId: string) {
    this.actionService.getAction(actionId).subscribe(
      data => {
        this.actions = data;
        console.log(this.actions);
        this.initialGet = true;
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
        this.initialGet = true;
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
      action => {
        // this.actions = data;
        console.log(action);
        this.expandAction = action._id
        this.getActions();
      },
      err => {
        if (err.status === 401) {
          this.router.navigate(["login"]);
        }
      }
    );
  }
  
  deleteActionDialog(action: Action): void {
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
  
  deleteEffectDialog(effect: Effect): void {
    const dialogRef = this.dialog.open(DeleteEffectDialog, {
      width: "480px",
      data: { effect: effect }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
      if (result) {
        console.log(result);
        this.deleteEffect(result.effect._id);
      }
    });
  }
  
  deleteEffect(effectId) {
    this.effectService.deleteEffect(effectId).subscribe(
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
  
  newEffectDialog(): void {
    const dialogRef = this.dialog.open(NewEffectDialog, {
      width: "480px",
      data: { name: this.name, sentiment: this.sentiment }
    });

    dialogRef.afterClosed().subscribe(effect => {
      console.log("The dialog was closed");
      if (effect) {
        this.saveEffect(effect);
      }
    });
  }
  
  newActionDialog(cause): void {
    const dialogRef = this.dialog.open(NewActionDialog, {
      width: '480px',
      data: { name: '', sentiment: 0 }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        console.log(result);
        this.saveAction(result, cause._id);
        this.getActions();
      }
    });
  }
  
  saveCause(cause: Cause, effectId: string) {
    this.causeService.saveCause(cause, effectId).subscribe(
      data => {
        // this.actions = data;
        console.log(data);
        this.getActions();
        this.name = '';
        this.sentiment = 0;
      },
      err => {
        if (err.status === 401) {
          this.router.navigate(["login"]);
        }
      }
    );
  }
  
  newCauseDialog(effectId: string): void {
    
    const dialogRef = this.dialog.open(NewCauseDialog, {
      width: "480px",
      data: { name: "", sentiment: 0 }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
      if (result) {
        console.log(result);
        this.saveCause(result, effectId);
        this.getActions();
      }
    });
    
    event.stopPropagation();
  }
  
  
  saveEffect(effect) {
    this.effectService.saveEffect(effect).subscribe(
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
  
  editCauseDialog(cause: Cause): void {
    const dialogRef = this.dialog.open(EditCauseDialog, {
      width: "480px",
      data: cause
    });

    dialogRef.afterClosed().subscribe(effect => {
      console.log("The dialog was closed");
      if (effect) {
        this.updateCause(cause);
      }
      this.getActions();
    });
  }
  
  updateCause(cause) {
    this.causeService.updateCause(cause).subscribe(
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
  
  editActionDialog(action: Action): void {
    const dialogRef = this.dialog.open(EditActionDialog, {
      width: "480px",
      data: action
    });

    dialogRef.afterClosed().subscribe(effect => {
      console.log("The dialog was closed");
      if (effect) {
        this.updateAction(action);
      }
      this.getActions();
    });
  }
  
  updateAction(action) {
    this.actionService.updateAction(action).subscribe(
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
  
  editEffectDialog(effect: Effect): void {
    const dialogRef = this.dialog.open(EditEffectDialog, {
      width: "480px",
      data: effect
    });

    dialogRef.afterClosed().subscribe(effect => {
      console.log("The dialog was closed");
      if (effect) {
        this.updateEffect(effect);
      }
      this.getActions();
    });
  }
  
  updateEffect(effect) {
    this.effectService.updateEffect(effect).subscribe(
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
expandAction(actionId) {
    this.expandedAction = actionId; 
  }

}


