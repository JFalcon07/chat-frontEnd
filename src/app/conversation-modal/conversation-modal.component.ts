import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { httpOptions, userInfo, URL} from '../config';
import { WebsocketService } from '../wSocket.service';

interface User {
  _id: string;
  username: string;
  checked: boolean;
}
 interface ResponseContacts {
  authorized: boolean;
  contacts: User[];
}
interface Data {
  added: boolean;
  message: string;
}
@Component({
  selector: 'app-conversation-modal',
  templateUrl: './conversation-modal.component.html',
  styleUrls: ['./conversation-modal.component.css']
})
export class ConversationModalComponent implements OnInit {
  users: User[];
  found: boolean;
  constructor(public dialogRef: MatDialogRef<ConversationModalComponent>,
    private http: HttpClient, private cookieService: CookieService, public snackBar: MatSnackBar, private webSocket: WebsocketService) { }
  ngOnInit() {
    this.getUsers();
  }
  onCancel(): void {
    this.dialogRef.close();
  }
  openSnackBar(message: string) {
    this.snackBar.open(message, undefined, {
      duration: 2000,
  });
  }
  getUsers() {
    this.users = [];
    const data = {
      token: this.cookieService.get('token'),
      email: userInfo.email,
      search: ''
    };
    this.http.post(URL + '/contacts', JSON.stringify(data), httpOptions)
    .subscribe((response: ResponseContacts) => {
      if (response.contacts.length > 0) {
        this.found = true;
        this.users = response.contacts;
        this.users.forEach(element => {
          element.checked = false;
        });
      } else {
        this.found = false;
      }
    });
  }
  getCheckboxes() {
    const users = this.users.filter(x => x.checked === true).map(x => x._id);
    users.push(userInfo._id);
    return users;
  }
  addUser() {
  const users = this.getCheckboxes();
  if (users.length < 3) { return this.openSnackBar('Please select more than one user'); }
  const data = {
    token: this.cookieService.get('token'),
    users: users
  };
  this.webSocket.addConversation(data);
  // this.http.post(URL + '/conversation', JSON.stringify(data), httpOptions)
  // .subscribe((response: Data) => {
  //   this.openSnackBar(response.message);
  //   if (response.added) { this.onCancel(); }
  // });
  }
}
