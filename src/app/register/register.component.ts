import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {MatSnackBar} from '@angular/material';
import { URL, languages, Language } from '../config';
import { passwordmatcher, RegisterObj, Data, defaultLanguage } from './register.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  languages: Language[];
  registerForm: FormGroup = new FormGroup({
    email: new FormControl ('', [Validators.required, Validators.email]),
    password:  new FormControl ('', [Validators.required, Validators.minLength(4)]),
    passwordConfirm:  new FormControl('', [Validators.required]),
    username:  new FormControl ('', [Validators.required]),
    language: new FormControl ('')
  }, {validators: passwordmatcher});

  constructor(public snackBar: MatSnackBar, private http: HttpClient, private router: Router) { }
  openSnackBar(message: string) {
    this.snackBar.open(message, undefined, {
      duration: 5000,
    });
  }
  get f() {
    return this.registerForm.controls;
  }
  register() {
    defaultLanguage();
    if (!this.registerForm.valid) {
      return this.openSnackBar('Some information is invalid');
    } else {
      this.registerRequest(this.registerForm.value);
    }
  }
  registerRequest(obj: RegisterObj) {
    if (!obj.language) { obj.language = defaultLanguage(obj.language); }
    console.log(obj);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    };
    httpOptions.headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post(URL + '/api/register', JSON.stringify(obj), httpOptions)
    .subscribe((data: Data) => {
      this.openSnackBar(data.message);
      if (data.signup) {
      this.router.navigate(['/login']);
      }
    });
  }
  ngOnInit() {
    this.languages = languages;
  }
}
