import { NewCauseDialog } from "../cause/new-cause.dialog";
import { DeleteCauseDialog } from "../cause/delete-cause.dialog";

import { NewActionDialog } from "../action/new-action.dialog";
import { DeleteActionDialog } from "../action/delete-action.dialog";

import { NewEffectDialog } from "./new-effect.dialog";
import { DeleteEffectDialog } from "./delete-effect.dialog";

import { Action } from "../_models/action.model";
import { Cause } from "../_models/cause.model";
import { Effect } from "../_models/effect.model";

import { ActionService } from "../_services/action.service";
import { CauseService } from "../_services/cause.service";
import { EffectService } from "../_services/effect.service";

import { Component, OnInit, Inject } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
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

  query:string = '';
  id:string = '';
  expandedEffect: string;
  effects: Effect[] = [];
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
    this.effectService.getEffectList().subscribe(
      data => {
        this.effects = data;
      },
      err => {
        if (err.status === 401) {
          this.router.navigate(["login"]);
        }
      }
    );
  }
  
  getEffectById(effectId) {
    this.effectService.getEffect(effectId).subscribe(
      data => {
        this.effects = data;
      },
      err => {
        if (err.status === 401) {
          this.router.navigate(["login"]);
        }
      }
    );
  }
  
  searchEffects(searchQuery) {
    this.effectService.searchEffect(searchQuery).subscribe(
      data => {
        this.effects = data;
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
    if(event.keyCode == 13) {
      if (this.query != '') {
        this.doSearch();
      } else {
        this.resetSearch();
      }
    } else {
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
        this.deleteCause(result.cause._id);
      }
    });
  }
  
  deleteCause(causeId) {
    this.causeService.deleteCause(causeId).subscribe(
      data => {
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
    this.effectService.saveEffect(effect).subscribe(
      data => {
        this.getEffects();
      },
      err => {
        if (err.status === 401) {
          this.router.navigate(["login"]);
        }
      }
    );
  }

  deleteEffect(effectId) {
    this.effectService.deleteEffect(effectId).subscribe(
      data => {
        this.getEffects();
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
  
  deleteAction(actionId: string) {
    this.actionService.deleteAction(actionId).subscribe(
      data => {
        this.getEffects();
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
        this.getEffects();
      }
    });
    
    event.stopPropagation();
  }

  saveCause(cause: Cause, effectId: string) {
    this.causeService.saveCause(cause, effectId).subscribe(
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
  
  saveAction(action, causeId) {
    this.actionService.saveAction(action, causeId).subscribe(
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
  
  newActionDialog(causeId: string): void {
    const dialogRef = this.dialog.open(NewActionDialog, {
      width: "480px",
      data: { name: this.name, sentiment: this.sentiment }
    });

    dialogRef.afterClosed().subscribe(action => {
      if (action) {
        this.saveAction(action, causeId);
      }
    });
  }

  logout() {
    localStorage.removeItem("jwtToken");
    this.router.navigate(["login"]);
  }
}


