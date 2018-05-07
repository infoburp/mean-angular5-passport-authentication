import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, RoutesRecognized } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";


@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  title = "app";
  username: string;
  actionsButtonColor = '';
  causesButtonColor = '';
  effectsButtonColor = '';
  loginButtonColor = '';
  signupButtonColor = '';

constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute) {
  router.events.subscribe(event => {
    if(event instanceof NavigationStart) {
    } else if (event instanceof NavigationEnd) {
      if (event.url.indexOf('actions') != -1) {
        console.log('actions')
        this.actionsButtonColor = 'primary';
        this.causesButtonColor = '';
        this.effectsButtonColor = '';
        this.loginButtonColor = '';
        this.signupButtonColor = '';
      } else if (event.url.indexOf('causes') != -1) {
        console.log('causes')
        this.actionsButtonColor = '';
        this.causesButtonColor = 'primary';
        this.effectsButtonColor = '';
        this.loginButtonColor = '';
        this.signupButtonColor = '';
      } else if (event.url.indexOf('effects') != -1) {
        console.log('effects')
        this.actionsButtonColor = '';
        this.causesButtonColor = '';
        this.effectsButtonColor = 'primary';
        this.loginButtonColor = '';
        this.signupButtonColor = '';
      } else if (event.url.indexOf('login') != -1) {
        console.log('effects')
        this.actionsButtonColor = '';
        this.causesButtonColor = '';
        this.effectsButtonColor = '';
        this.loginButtonColor = 'primary';
        this.signupButtonColor = '';
      } else if (event.url.indexOf('signup') != -1) {
        console.log('effects')
        this.actionsButtonColor = '';
        this.causesButtonColor = '';
        this.effectsButtonColor = '';
        this.loginButtonColor = '';
        this.signupButtonColor = 'primary';
      }
    }
    // NavigationCancel
    // NavigationError
    // RoutesRecognized
  });
};
  ngOnInit() {
    console.log(localStorage.getItem("jwtToken"));
    console.log(this.route.snapshot.toString())
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