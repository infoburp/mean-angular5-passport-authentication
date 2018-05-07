import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { UserService } from "../_services/user.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username = '';
  password = '';
  message = '';
  showPassword = false;

  constructor(private http: HttpClient, private router: Router, private userService: UserService) { }

  ngOnInit() {
  }

  login() {
    this.http.post<any>('/api/signin',{username: this.username, password: this.password}).subscribe(resp => {
      localStorage.removeItem('jwtToken');
      localStorage.setItem('jwtToken', resp.token);
      this.router.navigate(['effects']);
    }, err => {
      this.message = err.error.msg;
    });
  }
}
