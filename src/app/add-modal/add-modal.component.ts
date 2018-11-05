import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { httpOptions, userInfo, URL} from '../config';

interface User {
  email: string;
  username: string;
}
 interface Data {
  added: boolean;
  message: string;
}

@Component({
  selector: 'app-add-modal',
  templateUrl: './add-modal.component.html',
  styleUrls: ['./add-modal.component.css']
})
export class AddModalComponent implements OnInit {
  search = new FormControl('');
  users: User[];
  found: boolean;
  constructor(public dialogRef: MatDialogRef<AddModalComponent>,
  private http: HttpClient, private cookieService: CookieService, public snackBar: MatSnackBar) { }

  ngOnInit() {
  }
  onCancel(): void {
    this.dialogRef.close();
  }
  openSnackBar(message: string) {
    this.snackBar.open(message, undefined, {
      duration: 2000,
  });
  }
  getUsers(search: string) {
    if (!search) { return this.found = false; }
    this.users = [];
    const data = {
      token: this.cookieService.get('token'),
      email: userInfo.email,
      search: search
    };
    this.http.post(URL + '/users', JSON.stringify(data), httpOptions)
    .subscribe((response: User[]) => {
      if (response.length > 0) {
        this.found = true;
        this.users = response;
      } else {
        this.found = false;
      }
    });
  }
  addUser(user: string) {
    if (!user) { return this.openSnackBar('Please select or search an user'); }
    const data = {
      token: this.cookieService.get('token'),
      users: [userInfo.email, user]
    };
    this.http.post(URL + '/add', JSON.stringify(data), httpOptions)
    .subscribe((response: Data) => {
      this.openSnackBar(response.message);
      if (response.added) { this.onCancel(); }
    });
  }
}