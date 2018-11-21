import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { AddModalComponent } from '../add-modal/add-modal.component';
import { ConversationModalComponent } from '../conversation-modal/conversation-modal.component';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { httpOptions, userInfo, URL, SimpleUser, participants, Message, ChangeRes} from '../config';
import { DashboardService } from '../dashboard/dashboard.service';
import { WebsocketService } from '../wSocket.service';
import { Router } from '@angular/router';

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

interface RemovedContent {
  user: string;
  conversation: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  conversations = [];
  conversation;
  contacts = [];
  viewContacts: boolean;
  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    private data: DashboardService,
    private cookieService: CookieService,
    public snackBar: MatSnackBar,
    private router: Router,
    private webSocket: WebsocketService) {
      this.viewContacts = false;
    }

  async ngOnInit() {
    this.getContacts();
    this.getConversations()
      .subscribe((response: ConversationsResponse) => {
        if (response.authorized) {
          if (response.conversations.length > 0) {
            response.conversations.forEach( element => {
              element = this.configConversations(element);
            });
          this.conversations = response.conversations;
          }
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
          this.getContacts();
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

        this.webSocket.removedContact()
        .subscribe((removedContent: RemovedContent) => {
          this.conversations = this.conversations.filter((element: Conversation) => (element._id !== removedContent.conversation));
          this.contacts = this.contacts.filter((element: SimpleUser) => (element._id !== removedContent.user));
          if (this.conversation === removedContent.conversation) {
            this.router.navigate(['/chat']);
          }
        });

        this.webSocket.UsernameChanged()
        .subscribe((changeResponse: ChangeRes) => {
            if (changeResponse.changed) {
              this.userChange(changeResponse.user, changeResponse.value);
            }
        });
        this.webSocket.connect();
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
     return this.http.post(URL + '/api/Conversations', JSON.stringify(data), httpOptions);
  }
  newConversation() {
    this.dialog.open(ConversationModalComponent, {
      width: '350px',
      height: '500px'
    });
  }
  open(id: string) {
    event.preventDefault();
    this.conversations.forEach((conv: Conversation) => {
      if (conv._id === id) {
        conv.notRead = 0;
        this.router.navigate(['/chat',  { id: id }]);
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
    if (id === userInfo._id) {return false; }
    this.conversations.forEach((conv: Conversation) => {
      if (conv.participants.length > 2) { return false; }
      const conectedUser = conv.participants.filter(user => user._id === id)[0];
      if (!conectedUser) { return false; }
       conv.online = true;
    });
  }

  userChange(id: string, change) {
    if (id === userInfo._id) {return false; }
    this.conversations.forEach((conv: Conversation) => {
      conv.participants.forEach( element => {
        if (element._id === id) {
          element.username = change;
        }
        conv.sending = participants(conv.participants);
      });
    });
  }

  getContacts() {
    const data = {
      token: this.cookieService.get('token'),
      email: userInfo.email
    };
    this.http.post(URL + '/api/contacts', JSON.stringify(data), httpOptions)
    .subscribe((response: UsersResponse) => {
      if (response.authorized) {
        if (response.contacts.length > 0) {
          this.contacts = response.contacts;
        }
    }
    });
  }
  contactsChange() {
    this.viewContacts = !this.viewContacts;
  }
  deleteContact(id: string) {
    let conversationid;
    this.conversations.forEach((conv: Conversation) => {
      if (conv.participants.length > 2) { return false; }
        for (let i = 0; i < conv.participants.length; i++) {
          if (conv.participants[i]._id === id) {
            conversationid = conv._id;
          }
        }
    });
    const data = {
      token: this.cookieService.get('token'),
      user: userInfo._id,
      contact: id,
      conversation: conversationid
    };
    this.webSocket.removeContact(data);
  }
}
