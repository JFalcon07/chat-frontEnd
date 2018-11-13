import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DashboardService } from './dashboard.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  conversation;
  constructor(private data: DashboardService, private router: Router, private route: ActivatedRoute, private cookieService: CookieService) {
    this.route.params.subscribe(params => {
      this.conversation = params['id'];
      this.data.changeConversation(this.conversation);
  });
   }

  ngOnInit() {
    this.conversation = undefined;
    this.data.currentConversation.subscribe(conversation => this.conversation = conversation);
    this.data.changeConversation(this.conversation);
  }
  logout() {
    this.cookieService.delete('token');
  }
}
