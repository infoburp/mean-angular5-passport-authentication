import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { UserService } from "../_services/user.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupData = { username:'', password:'' };
  message = '';
  showPassword = false;
  constructor(private http: HttpClient, private router: Router, private userService: UserService) { }

  ngOnInit() {
  }

  signup() {
    this.http.post<any>('/api/signup',this.signupData).subscribe(resp => {
      if (resp.success) {
        this.router.navigate(['login']);
      } else {
        this.message = resp.msg;
      }
    }, err => {
      this.message = err.error.msg;
    });
  }
}
