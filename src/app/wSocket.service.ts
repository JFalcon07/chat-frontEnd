import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import { URL, Message } from './config';
import { userInfo } from './config';
// import * as Rx from 'rxjs/Rx';

@Injectable()
export class WebsocketService  {
    private socket;
    constructor() {
        this.socket = io(URL);
     }
    connect() {
        this.socket.emit('linkUser', userInfo._id);
    }

    joinRoom(conversation: string) {
        this.socket.emit('join', conversation);
    }

    addUser(user) {
        this.socket.emit('addUser', user);
    }
    addConversation(conversation) {
        this.socket.emit('addConversation', conversation);
    }
    sendMessage(msg) {
        this.socket.emit('message', msg);
    }

    leaveRoom() {
        this.socket.emit('leave', null);
    }
    removeContact(removeData) {
        this.socket.emit('remove', removeData);
    }
    changePassword(change) {
        this.socket.emit('changePassword', change);
    }
    changeUsername(change) {
        this.socket.emit('changeUsername', change);
    }
    changeLanguage(change) {
        this.socket.emit('changeLanguage', change);
    }

    messageRecieved() {
        const observable = new Observable<Message>(observer => {
            this.socket.on('messageRecieved', (msg) => {
                observer.next(msg);
            });
            return () => this.socket.disconnect();
        });
        return observable;
    }

    PasswordChanged() {
        const observable = new Observable(observer => {
            this.socket.on('PasswordChanged', (changed) => {
                observer.next(changed);
            });
            return () => this.socket.disconnect();
        });
        return observable;
    }
    UsernameChanged() {
        const observable = new Observable(observer => {
            this.socket.on('UsernameChanged', (changed) => {
                observer.next(changed);
            });
            return () => this.socket.disconnect();
        });
        return observable;
    }
    LanguageChanged() {
        const observable = new Observable(observer => {
            this.socket.on('LanguageChanged', (changed) => {
                observer.next(changed);
            });
            return () => this.socket.disconnect();
        });
        return observable;
    }

    removedContact() {
        const observable = new Observable(observer => {
            this.socket.on('removedContact', (contact) => {
                observer.next(contact);
            });
            return () => this.socket.disconnect();
        });
        return observable;
    }

    addedUser() {
        const observable = new Observable(observer => {
            this.socket.on('addedUser', (data) => {
                observer.next(data);
            });
            return () => this.socket.disconnect();
        });
        return observable;
    }

    newConversation() {
        const observable = new Observable(observer => {
            this.socket.on('newConversation', (data) => {
                observer.next(data);
            });
            return () => this.socket.disconnect();
        });
        return observable;
    }

    joinedRoom() {
        const observable = new Observable(observer => {
            this.socket.on('joined', (data) => {
                observer.next(data);
            });
            return () => this.socket.disconnect();
        });
        return observable;
    }

    online() {
        const observable = new Observable(observer => {
            this.socket.on('online', (id) => {
                observer.next(id);
            });
            return () => this.socket.disconnect();
        });
        return observable;
    }
    offline() {
        const observable = new Observable(observer => {
            this.socket.on('offline', (id) => {
                observer.next(id);
            });
            return () => this.socket.disconnect();
        });
        return observable;
    }
    disconnect() {
        this.socket.disconnect();
    }
}
