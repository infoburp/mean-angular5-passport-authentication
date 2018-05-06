import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  title = "app";
  username: string;
  actionCount = 0;
  causeCount = 0;
  effectCount = 0;
  
  constructor(private router: Router, private http: HttpClient) {}
  
  ngOnInit() {
    console.log(localStorage.getItem("jwtToken"));
    this.username = localStorage.getItem("username");
    this.getCounts();
  }

  getCounts() {
    if (this.loggedIn()){
      let httpOptions = {
        headers: new HttpHeaders({
          Authorization: localStorage.getItem("jwtToken")
        })
      };
      this.http.get<Counts>("/api/counts", httpOptions).subscribe(
        data => {
          console.log(data);
          this.actionCount = data.action;
          this.causeCount = data.cause;
          this.effectCount = data.effect;
        },
        err => {
          if (err.status === 401) {
            this.router.navigate(["login"]);
          }
        }
      );
    }
  }
  
  loggedIn() {
    return localStorage.getItem("jwtToken") ? true : false;
  }

  logout() {
    localStorage.clear();
    this.router.navigate(["login"]);
  }
}

export interface Counts {
  effect: number;
  cause: number;
  action: number;
}