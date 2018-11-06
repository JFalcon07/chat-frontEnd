import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard/dashboard.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { httpOptions, userInfo, URL, SimpleUser, participants} from '../config';


interface Conversation {
  messages: any[];
  participants: SimpleUser[];
  _id: string;
}

interface ConversationsResponse {
  authorized: boolean;
  conversation: Conversation;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  conversation;
  participants: string;
  messages = [];
  user;
  constructor(private data: DashboardService, private http: HttpClient, private cookieService: CookieService) {
    this.user = userInfo._id;
  }

  ngOnInit() {
    this.data.currentConversation.subscribe((conversation: Conversation) => {
      this.conversation = conversation;
      if (this.conversation) {
        this.getMessages(conversation._id);
      }
    });
  }
  getMessages(id: string) {
    const Options = {
      headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.cookieService.get('token')
    })};
    Options.headers.append('Access-Control-Allow-Origin', '*');
    Options.headers.append('Access-Control-Allow-Headers', '*');
    this.http.get(URL + '/conversation/' + this.conversation, Options)
    .subscribe((Response: ConversationsResponse) => {
      this.messages = Response.conversation.messages;
      this.participants = participants(Response.conversation.participants);
    });
  }
  send(message: string) {
    if (!message) { return false; }
    const messageData = {
      token: this.cookieService.get('token'),
      _id: this.conversation,
      user: this.user,
      message: message,
      type: 'text',
      date: new Date()
    };
    this.http.post(URL + '/message', JSON.stringify(messageData), httpOptions)
    .subscribe(() => {
       this.getMessages(this.conversation);
    });
  }

}
