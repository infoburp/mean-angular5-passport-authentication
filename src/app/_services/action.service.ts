import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Action } from "../_models/action.model";
import { Observable } from "rxjs/Observable";

@Injectable()
export class ActionService implements OnInit {
  constructor(private http: HttpClient) { }
  httpOptions: any;

  getAction(actionId: string): Observable<ArrayBuffer> {
    return this.http.get("/api/action/" + actionId, this.httpOptions)
  }
  
  getActionList(): Observable<ArrayBuffer> {
    return this.http.get("/api/action", this.httpOptions)
  }
  
  saveAction(action: Action, causeId: string) {
    return this.http.post("/api/action/" + causeId, action, this.httpOptions);
  }
  
  searchAction(searchQuery) {
    return this.http.get("/api/action/search/" + searchQuery, this.httpOptions);
  }
  
  deleteAction(actionId: string): any {
    return this.http.delete("/api/action/" + actionId, this.httpOptions);
  }
  
  ngOnInit() {
    this.httpOptions = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem("jwtToken")
      })
    };
  }
  
}