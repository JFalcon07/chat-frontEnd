import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { AddModalComponent } from '../add-modal/add-modal.component';
import { ConversationModalComponent } from '../conversation-modal/conversation-modal.component';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { httpOptions, userInfo, URL, SimpleUser, participants, Message} from '../config';
import { DashboardService } from '../dashboard/dashboard.service';
import { WebsocketService } from '../wSocket.service';

interface Conversation {
  _id: string;
  participants: SimpleUser[] | string;
  message?: string;
  notRead: number;
}
interface UsersResponse {
  authorized: boolean;
  contacts: SimpleUser[];
}
interface ConversationsResponse {
  authorized: boolean;
  conversations: Conversation[];
}
interface NewConversation {
  added: boolean;
  conversation: Conversation;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  conversations = [];
  conversation;
  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    private data: DashboardService,
    private cookieService: CookieService,
    public snackBar: MatSnackBar,
    private webSocket: WebsocketService) {
      this.webSocket.joinedRoom()
      .subscribe();
    }

  ngOnInit() {
    this.getConversations();
    this.data.currentConversation.subscribe((conversation: Conversation) => {
      this.conversation = conversation;
    });
    this.webSocket.messageRecieved()
    .subscribe((message: Message) => {
      if (message.room === this.conversation) { return false; }
      this.conversations.forEach((conv: Conversation) => {
        if (message.room === conv._id) {
          conv.notRead++;
        }
      });
    });
    this.webSocket.addedUser()
    .subscribe((conversation: Conversation) => {
      if (conversation.participants) {
      conversation.participants = participants(<SimpleUser[]>conversation.participants);
      conversation.notRead = 0;
      this.conversations.push(conversation);
      return this.dialog.closeAll();
      }
      return this.snackBar.open(conversation.message, undefined, {
        duration: 2000,
      });
    });
    this.webSocket.newConversation()
    .subscribe((newconversation: NewConversation) => {
      if (newconversation.added) {
        newconversation.conversation.participants = participants(<SimpleUser[]>newconversation.conversation.participants);
        this.conversations.push(newconversation.conversation);
        return this.dialog.closeAll();
      }
    });
  }
  addContact(): void {
    this.dialog.open(AddModalComponent, {
      width: '350px',
      height: '500px'
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
            this.webSocket.joinRoom(element._id);
            element.participants = participants(<SimpleUser[]>element.participants);
            element.notRead = 0;
          });
          this.conversations = response.conversations;
        }
    }
    });
  }
  newConversation() {
    this.dialog.open(ConversationModalComponent, {
      width: '350px',
      height: '500px'
    });
  }
  open(id: string) {
    this.conversations.forEach((conv: Conversation) => {
      if (conv._id === id) {
        conv.notRead = 0;
      }
    });
  }
}
