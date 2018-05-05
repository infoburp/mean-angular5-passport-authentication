import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

@Component({
  selector: 'app-averages',
  templateUrl: './averages.component.html',
  styleUrls: ['./averages.component.css']
})
export class AveragesComponent implements OnInit {
  displayedColumns = ['average_sentiment', 'day'];
  averages: any;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.getAverages();
  }

  getAverages() {
    let httpOptions = {
      headers: new HttpHeaders({ 'Authorization': localStorage.getItem('jwtToken') })
    };
    this.http.get('/api/average-daily-sentiment', httpOptions).subscribe(data => {
      this.averages = data;
      // console.log(this.actions);
    }, err => {
      if (err.status === 401) {
        this.router.navigate(['login']);
      }
    });
  }





  logout() {
    localStorage.removeItem('jwtToken');
    this.router.navigate(['login']);
  }

}
