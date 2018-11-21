import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { TranslateService } from '@ngx-translate/core';

import { httpOptions, userInfo, URL} from '../config';
import { WebsocketService } from '../wSocket.service';

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
  selectedUser: string;
  constructor(public dialogRef: MatDialogRef<AddModalComponent>,
  private http: HttpClient,
  private cookieService: CookieService,
  public snackBar: MatSnackBar,
  private translate: TranslateService,
  private webSocket: WebsocketService) { }

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
    this.http.post(URL + '/api/users', JSON.stringify(data), httpOptions)
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
    if (!user) { return this.translate.get('messages.selectUser').subscribe(value => { this.openSnackBar(value); }); }
    const data = {
      token: this.cookieService.get('token'),
      user: userInfo._id,
      users: [userInfo.email, user]
    };
    this.webSocket.addUser(data);
  }
}
