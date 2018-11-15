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
  sending: string;
  participants: SimpleUser[];
  message?: string;
  notRead: number;
  online?: boolean;
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
    }

  async ngOnInit() {
    await this.getConversations();
    this.webSocket.connect();
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
      conversation = this.configConversations(conversation);
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
        newconversation.conversation = this.configConversations(newconversation.conversation);
        this.conversations.push(newconversation.conversation);
        return this.dialog.closeAll();
      }
    });
    this.webSocket.online()
    .subscribe((id: string) => {
      this.online(id);
    });
    this.webSocket.offline()
    .subscribe((id: string) => {
      this.conversations.forEach((conv: Conversation) => {
        if (conv.participants.length > 2) { return false; }
        const disconectedUser = conv.participants.filter(user => user._id === id)[0];
        if (!disconectedUser) { return false; }
        conv.online = false;
      });
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
     return this.http.post(URL + '/Conversations', JSON.stringify(data), httpOptions)
    .subscribe((response: ConversationsResponse) => {
      if (response.authorized) {
        if (response.conversations.length > 0) {
          response.conversations.forEach( element => {
            element = this.configConversations(element);
          });
         return this.conversations = response.conversations;
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
  configConversations(conversation: Conversation) {
    this.webSocket.joinRoom(conversation._id);
    if (conversation.participants.length === 2) { conversation.online = false; }
    conversation.sending = participants(conversation.participants);
    conversation.notRead = 0;
    return conversation;
  }

  online(id: string) {
    this.conversations.forEach((conv: Conversation) => {
      if (conv.participants.length > 2) { return false; }
      const conectedUser = conv.participants.filter(user => user._id === id)[0];
      if (!conectedUser) { return false; }
       conv.online = true;
    });
  }
}
