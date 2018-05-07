import { NewActionDialog } from "../action/new-action.dialog";
import { DeleteActionDialog } from "../action/delete-action.dialog";

import { NewCauseDialog } from "./new-cause.dialog";
import { DeleteCauseDialog } from "./delete-cause.dialog";

import { NewEffectDialog } from "../effect/new-effect.dialog";
import { DeleteEffectDialog } from "../effect/delete-effect.dialog";

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
import {BrowserModule} from '@angular/platform-browser'
import { animate, state, style, transition, trigger } from '@angular/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: "app-cause",
  templateUrl: "./cause.component.html",
  styleUrls: ["./cause.component.css"],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({opacity: '0'}),
        animate(400, style({opacity: '1'})) 
      ]),
      transition(':leave', [   
        style({opacity: '1'}),
        animate(400, style({opacity: '0'})) 
      ])
    ])
  ],
})
export class CauseComponent implements OnInit {

  query:string = '';
  id:string = '';
  expandedCause: any;
  causes: any = [];
  data: any = { children: [] };
  name = "";
  sentiment = 0;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private effectService: EffectService,
    private causeService: CauseService,
    private actionService: ActionService
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
    this.causeService.getCauseList().subscribe(
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
    this.causeService.getCause(causeId).subscribe(
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
    this.causeService.searchCause(searchQuery).subscribe(
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
  
  deleteDialog(cause): void {
    const dialogRef = this.dialog.open(DeleteCauseDialog, {
      width: "480px",
      data: { cause: cause }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
      if (result) {
        console.log(result);
        this.deleteCause(result.cause._id);
        this.getCauses();
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
        
        this.getCauses();
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
        if (this.query == this.name) {
          this.query = '';
        }
        this.name = '';
        this.sentiment = 0;
        this.getCauses();
        
      },
      err => {
        if (err.status === 401) {
          this.router.navigate(["login"]);
        }
      }
    );
  }
  
  deleteAction(actionId) {
    this.actionService.deleteAction(actionId).subscribe(
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
        this.getCauses();
      }
    });
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
        this.getCauses();
      }
    });
    
    event.stopPropagation();
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

  saveAction(action, causeId) {
    this.actionService.saveAction(action, causeId).subscribe(
      data => {
        // this.actions = data;
        console.log(data);
        this.name = '';
        this.sentiment = 0;
        this.getCauses();
      },
      err => {
        if (err.status === 401) {
          this.router.navigate(['login']);
        }
      }
    );
  }
  
  saveCause(cause: Cause, effectId: string) {
    this.causeService.saveCause(cause, effectId).subscribe(
      data => {
        // this.actions = data;
        console.log(data);
        this.getCauses();
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


  deleteActionDialog(action): void {
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
  viewCause(cause) {}

  deleteCause(causeId) {
    this.causeService.deleteCause(causeId).subscribe(
      data => {
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



