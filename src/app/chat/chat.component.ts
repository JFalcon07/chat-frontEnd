import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard/dashboard.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { httpOptions, userInfo, URL} from '../config';

interface Conversation {
  messagges: [];
  participants: string;
  _id: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  conversation;
  messages = [];
  constructor(private data: DashboardService, private http: HttpClient, private cookieService: CookieService) { }

  ngOnInit() {
    this.data.currentConversation.subscribe((conversation: Conversation) => {
      console.log(conversation);
      this.conversation = conversation;
      this.getMessages(conversation._id);
    });
  }
  getMessages(id: string) {
    const data = {
      token: this.cookieService.get('token'),
      _id: id
    };
    const Options = {
      headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.cookieService.get('token')
    })};
    Options.headers.append('Access-Control-Allow-Origin', '*');
    Options.headers.append('Access-Control-Allow-Headers', '*');
    this.http.get(URL + '/conversation/' + this.conversation, Options)
    .subscribe((Response) => {
      console.log(Response);
    });
  }

}
