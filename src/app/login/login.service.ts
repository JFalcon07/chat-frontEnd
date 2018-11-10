import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

import { CookieService } from 'ngx-cookie-service';

export interface Data {
  login: boolean;
  message: string;
  token: string;
  error?: any;
}
const helper = new JwtHelperService();

@Injectable()
export class Logged {
constructor(private cookieService: CookieService) {}

public isAuthenticated(): boolean {
    let isLoggedIn = false;
    if (!this.cookieService.get('token')) {
        isLoggedIn = false;
        return isLoggedIn;
    }
    const token = this.cookieService.get('token');
    isLoggedIn = helper.isTokenExpired(token);
    return !isLoggedIn;
    }
}
