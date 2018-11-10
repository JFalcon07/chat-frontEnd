import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddModalComponent } from '../add-modal/add-modal.component';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { httpOptions, userInfo, URL, SimpleUser, participants} from '../config';
import { DashboardService } from '../dashboard/dashboard.service';
import { WebsocketService } from '../wSocket.service';

interface Conversation {
  _id: string;
  participants: SimpleUser[] | string;
}
interface UsersResponse {
  authorized: boolean;
  contacts: SimpleUser[];
}
interface ConversationsResponse {
  authorized: boolean;
  conversations: Conversation[];
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  contacts = [];
  conversations = [];
  conversation;
  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    private cookieService: CookieService,
    private data: DashboardService,
    private webSocket: WebsocketService) {
      this.webSocket.joinedRoom()
      .subscribe(msg => console.log(msg));
    }

  ngOnInit() {
    // this.data.currentConversation.subscribe(conversation => this.conversation = conversation);
    this.getConversations();
    this.getContacts();
  }
  addContact(): void {
    const dialogRef = this.dialog.open(AddModalComponent, {
      width: '350px',
      height: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getContacts();
    });
  }
  getContacts() {
    const data = {
      token: this.cookieService.get('token'),
      email: userInfo.email
    };
    this.http.post(URL + '/contacts', JSON.stringify(data), httpOptions)
    .subscribe((response: UsersResponse) => {
      if (response.authorized) {
        if (response.contacts.length > 0) {
          this.contacts = response.contacts;
        }
    }
    });
  }
  getConversations() {
    const data = {
      token: this.cookieService.get('token'),
      _id: userInfo._id
    };
    this.http.post(URL + '/Conversations', JSON.stringify(data), httpOptions)
    .subscribe((response: ConversationsResponse) => {
      if (response.authorized) {
        if (response.conversations.length > 0) {
          response.conversations.forEach( element => {
            element.participants = participants(<SimpleUser[]>element.participants);
          });
          this.conversations = response.conversations;
        }
    }
    });
  }
  join(room) {
    this.webSocket.leaveRoom();
    this.webSocket.joinRoom(room);
  }
}
