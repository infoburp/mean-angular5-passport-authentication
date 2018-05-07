import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Action } from "../_models/action.model";
import { Observable } from "rxjs/Observable";

@Injectable()
export class ActionService {
  constructor(private http: HttpClient) { }

  getAction(actionId: string): Observable<Action[]> {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem("jwtToken")
      })
    };
    return this.http.get<Action[]>("/api/action/" + actionId, httpOptions)
  }
  
  getActionList(): Observable<Action[]> {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem("jwtToken")
      })
    };
    return this.http.get<Action[]>("/api/action", httpOptions)
  }
  
  saveAction(action: Action, causeId: string): any {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem("jwtToken")
      })
    };
    return this.http.post("/api/action/" + causeId, action, httpOptions);
  }
  
  updateAction(action: Action) {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem("jwtToken")
      })
    };
    return this.http.put("/api/action/" + action._id, action, httpOptions);
  }
  
  searchAction(searchQuery): Observable<Action[]>  {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem("jwtToken")
      })
    };
    return this.http.get<Action[]>("/api/action/search/" + searchQuery, httpOptions);
  }
  
  deleteAction(actionId: string): any {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem("jwtToken")
      })
    };
    return this.http.delete("/api/action/" + actionId, httpOptions);
  }
  
}