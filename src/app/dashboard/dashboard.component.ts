import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DashboardService } from './dashboard.service';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

import { WebsocketService } from '../wSocket.service';
import { httpOptions, userInfo, URL, setUser, User, ChangeRes } from '../config';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  conversation;
  username: string;
  settings: boolean;
  constructor(private data: DashboardService,
    private router: Router,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private webSocket: WebsocketService,
    private http: HttpClient,
    private translate: TranslateService) {
   }

  ngOnInit() {
    this.translate.setDefaultLang('en');
    this.route.params.subscribe(params => {
      this.conversation = params.id;
      this.data.changeConversation(this.conversation);
  });
    this.http.post(URL + '/api/userInfo', JSON.stringify({token: this.cookieService.get('token'), user: userInfo._id}), httpOptions)
    .subscribe((user: User) => {
      setUser(user.username, user.language);
      this.translate.use(user.language);
      this.username = userInfo.username;
    });
    this.settings = false;
    this.conversation = undefined;
    this.data.currentConversation.subscribe(conversation => this.conversation = conversation);
    this.data.changeConversation(this.conversation);
    this.webSocket.UsernameChanged()
    .subscribe((changeResponse: ChangeRes) => {
        if (changeResponse.changed) {
          this.username = changeResponse.value;
        }
    });
  }
  logout() {
    this.webSocket.disconnect();
    this.cookieService.deleteAll();
  }
  settingsView() {
    this.settings = true;
  }
}
