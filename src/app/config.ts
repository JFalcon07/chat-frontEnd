import { HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

interface User {
    email: string;
    username: string;
}

const helper = new JwtHelperService();

export const URL = 'http://localhost:3000';

export  const httpOptions = (() => {
    const Options = {
    headers: new HttpHeaders({
    'Content-Type': 'application/json'})
  };
  Options.headers.append('Access-Control-Allow-Origin', '*');
  return Options;
})();

export const userInfo = {
    _id: undefined,
    email: undefined
};

export function userSet(token: string) {
    userInfo._id = helper.decodeToken(token).id;
    userInfo.email = helper.decodeToken(token).email;
}
