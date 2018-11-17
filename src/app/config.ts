import { HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Moment } from 'moment';

export interface User {
    email: string;
    username: string;
    language?: string;
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
    email: undefined,
    username: undefined,
    language: undefined
};

export function tokenSet(token: string) {
    userInfo._id = helper.decodeToken(token).id;
    userInfo.email = helper.decodeToken(token).email;
}
export function setUser(username, language) {
    userInfo.username = username;
    userInfo.language = language;
}

export interface SimpleUser {
    _id: string;
    username: string;
}

export function participants(users: SimpleUser[]): string {
    const part = users.map((user: SimpleUser) => {
     if (user._id !== userInfo._id) {
       return user.username;
     }
   }).filter(Boolean).join(', ');
   return part;
 }
 export interface Message {
     room: string;
    _id:  string;
    user: string;
    sender: string;
    message: string;
    type: string;
    date: Moment;
}

export interface Language {
    value: string;
    viewValue: string;
}

export const languages: Language[] = [
    {value: 'en', viewValue: 'English'},
    {value: 'es', viewValue: 'Spanish'}
];
