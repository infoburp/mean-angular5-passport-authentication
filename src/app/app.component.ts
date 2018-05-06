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
  
  constructor(private router: Router, private http: HttpClient) {}
  
  ngOnInit() {
    console.log(localStorage.getItem("jwtToken"));
    this.username = localStorage.getItem("username");
  }
  
  loggedIn() {
    return localStorage.getItem("jwtToken") ? true : false;
  }

  logout() {
    localStorage.clear();
    this.router.navigate(["login"]);
  }
}