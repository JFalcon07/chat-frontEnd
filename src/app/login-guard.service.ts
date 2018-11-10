import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Logged } from './login/login.service';

@Injectable()
export class LoginGuardService implements CanActivate {
constructor(private logged: Logged, public router: Router) {}
    canActivate(): boolean {
        if (!this.logged.isAuthenticated()) {
            this.router.navigate(['login']);
            return false;
        }
        return true;
    }
}
