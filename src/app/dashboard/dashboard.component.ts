import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  conversation;
  constructor(private data: DashboardService, private router: Router, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.conversation = params['id'];
      this.data.changeConversation(this.conversation);
  });
   }

  ngOnInit() {
    this.data.currentConversation.subscribe(conversation => this.conversation = conversation);
  }

}
