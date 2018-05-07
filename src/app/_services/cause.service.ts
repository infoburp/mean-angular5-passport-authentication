import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Cause } from "../_models/cause.model";
import { Observable } from "rxjs/Observable";

@Injectable()
export class CauseService {
  constructor(private http: HttpClient) { }

  getCause(causeId?: string): Observable<Cause[]> {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem("jwtToken")
      })
    };
    return this.http.get<Cause[]>("/api/cause/" + causeId, httpOptions)
  }
  
  getCauseList(causeId?: string): Observable<Cause[]> {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem("jwtToken")
      })
    };
    return this.http.get<Cause[]>("/api/cause", httpOptions)
  }
  
  saveCause(cause: Cause, effectId: string): any {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem("jwtToken")
      })
    };
    return this.http.post("/api/cause/" + effectId, cause, httpOptions);
  }
  
  updateCause(cause: Cause) {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem("jwtToken")
      })
    };
    return this.http.put("/api/cause/" + cause._id, cause, httpOptions);
  }
  
  searchCause(searchQuery): Observable<Cause[]> {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem("jwtToken")
      })
    };
    return this.http.get<Cause[]>("/api/cause/search/" + searchQuery, httpOptions);
  }
  
  deleteCause(causeId: string): any {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem("jwtToken")
      })
    };
    return this.http.delete("/api/cause/" + causeId, httpOptions);
  }
  
}