import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { DashboardService } from '../dashboard/dashboard.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { httpOptions, userInfo, URL, SimpleUser, participants, Message} from '../config';
import { WebsocketService } from '../wSocket.service';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { getUsername } from './chat.service';
import { Router } from '@angular/router';

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
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('scroll', {read: ElementRef}) private myScrollContainer: ElementRef;
  conversation;
  participants: SimpleUser[];
  others: string;
  messages = [];
  user;
  messageControl = new FormControl('');
  constructor(private data: DashboardService,
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router,
    private webSocket: WebsocketService) {
    this.user = userInfo._id;
  }

  async ngOnInit() {
    await this.data.currentConversation.subscribe(async (conversation: Conversation) => {
      this.conversation = conversation;
      if (this.conversation) {
        this.messageControl.setValue('');
        await this.getMessages(conversation._id);
      }
    });

  }

  ngAfterViewChecked() {
    this.scrollToBottom();
    this.webSocket.messageRecieved()
    .subscribe((msg: Message) => {
      if (msg.room !== this.conversation) { return false; }
      msg.user = getUsername(this.participants, msg.sender);
      msg.date = moment(msg.date);
      this.messages.push(msg);
      this.scrollToBottom();
    });
    this.scrollToBottom();
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
      if (!Response.conversation) { return this.router.navigate(['/chat']); }
      this.participants = Response.conversation.participants;
      this.others = participants(Response.conversation.participants);
      Response.conversation.messages.forEach((elem) => {
        elem.user = getUsername(this.participants, elem.sender);
        elem.date = moment(elem.date);
      });
      this.messages = Response.conversation.messages;
    });
  }
  send() {
    const message = this.messageControl.value;
    if (!message) { return false; }
    const messageData = {
      token: this.cookieService.get('token'),
      _id: this.conversation,
      user: this.user,
      message: message,
      type: 'text',
      date: new Date()
    };
    this.messageControl.setValue('');
    this.webSocket.sendMessage(messageData);
  }
  scrollToBottom(): void {
    try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
}
}
