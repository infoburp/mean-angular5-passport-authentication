import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Observable";

@Injectable()
export class CountService {
  constructor(private http: HttpClient) { }
  httpOptions: any;
}