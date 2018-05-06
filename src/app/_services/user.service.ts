import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs/Observable";


@Injectable()
export class UserService {
  constructor(private http: HttpClient) { }
  login(loginData) {
    return this.http.post('/api/signin',loginData);
  }
  signup(signupData) {
    return this.http.post('/api/signup',signupData);
  }
}