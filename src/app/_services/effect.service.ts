import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Effect } from "../_models/effect.model";
import { Observable } from "rxjs/Observable";

@Injectable()
export class EffectService implements OnInit {
  constructor(private http: HttpClient) { }
  httpOptions: any;
  
  getEffect(effectId: string): Observable<ArrayBuffer> {
    return this.http.get("/api/effect/" + effectId, this.httpOptions)
  }
  
  getEffectList(): Observable<ArrayBuffer> {
    return this.http.get("/api/effect", this.httpOptions)
  }
  
  saveEffect(effect: Effect) {
    return this.http.post("/api/effect", effect, this.httpOptions);
  }
  
  searchEffect(searchQuery) {
    return this.http.get("/api/effect/search/" + searchQuery, this.httpOptions);
  }
  
  deleteEffect(effectId: string): any {
    return this.http.delete("/api/effect/" + effectId, this.httpOptions);
  }
  
  ngOnInit() {
    this.httpOptions = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem("jwtToken")
      })
    };
  }
  
}