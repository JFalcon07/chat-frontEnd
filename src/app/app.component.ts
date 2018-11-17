import { Component, OnInit } from '@angular/core';
import { tokenSet } from './config';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'chat';
  constructor(private cookieService: CookieService) {}
  ngOnInit() {
    if (this.cookieService.get('token')) {
      tokenSet(this.cookieService.get('token'));
    }
  }
}
