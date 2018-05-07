import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Effect } from "../_models/effect.model";
import { Observable } from "rxjs/Observable";

@Injectable()
export class EffectService {
  constructor(private http: HttpClient) { }
  
  getEffect(effectId: string): Observable<Effect[]> {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem("jwtToken")
      })
    };
    return this.http.get<Effect[]>("/api/effect/" + effectId, httpOptions)
  }
  
  getEffectList(): Observable<Effect[]> {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem("jwtToken")
      })
    };
    return this.http.get<Effect[]>("/api/effect", httpOptions)
  }
  
  saveEffect(effect: Effect) {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem("jwtToken")
      })
    };
    return this.http.post("/api/effect", effect, httpOptions);
  }
  
  updateEffect(effect: Effect) {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem("jwtToken")
      })
    };
    return this.http.put("/api/effect/" + effect._id, effect, httpOptions);
  }
  
  searchEffect(searchQuery): Observable<Effect[]>  {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem("jwtToken")
      })
    };
    return this.http.get<Effect[]>("/api/effect/search/" + searchQuery, httpOptions);
  }
  
  deleteEffect(effectId: string): any {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem("jwtToken")
      })
    };
    return this.http.delete("/api/effect/" + effectId, httpOptions);
  }
  
}