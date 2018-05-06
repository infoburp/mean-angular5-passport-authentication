import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Cause } from "../_models/cause.model";
import { Observable } from "rxjs/Observable";

@Injectable()
export class CauseService implements OnInit {
  constructor(private http: HttpClient) { }
  httpOptions: any;

  getCause(causeId?: string): Observable<ArrayBuffer> {
    return this.http.get("/api/cause/" + causeId, this.httpOptions)
  }
  
  getCauseList(causeId?: string): Observable<ArrayBuffer> {
    return this.http.get("/api/cause", this.httpOptions)
  }
  
  saveCause(cause: Cause, effectId: string) {
    return this.http.post("/api/cause/" + effectId, cause, this.httpOptions);
  }
  
  searchCause(searchQuery) {
    return this.http.get("/api/cause/search/" + searchQuery, this.httpOptions);
  }
  
  deleteCause(causeId: string): any {
    return this.http.delete("/api/cause/" + causeId, this.httpOptions);
  }
  
  ngOnInit() {
    this.httpOptions = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem("jwtToken")
      })
    };
  }
  
}