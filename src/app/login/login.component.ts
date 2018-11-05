import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Data } from './login.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { httpOptions, URL, userSet } from '../config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  passwordFormControl = new FormControl('', [
    Validators.required
  ]);
  constructor(public snackBar: MatSnackBar, private http: HttpClient, private router: Router, private cookieService: CookieService) {}
  login() {
    if (this.emailFormControl.errors || this.passwordFormControl.errors) {
        return this.openSnackBar('Invalid data');
    }
    this.loginRequest({email: this.emailFormControl.value, password: this.passwordFormControl.value});
  }
  openSnackBar(message: string) {
      this.snackBar.open(message, undefined, {
        duration: 2000,
    });
  }
  loginRequest(obj) {
    console.log(httpOptions);
    return this.http.post(URL + '/login', JSON.stringify(obj), httpOptions)
    .subscribe((data: Data) => {
      console.log(data);
      this.openSnackBar(data.message);
      if (data.login) {
        this.cookieService.set('token', data.token);
        userSet(data.token);
        this.router.navigate(['/home']);
      }
    });
  }
  ngOnInit() {
  }

}
