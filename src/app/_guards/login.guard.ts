import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from "@angular/router";

@Injectable()
export class LoginGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate() {
    if (localStorage.getItem("jwtToken")) {
        return true;
    } else {
        this.router.navigate(['/login']);
    }
    return false;
  }
}