import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import { URL, Message } from './config';
// import * as Rx from 'rxjs/Rx';

@Injectable()
export class WebsocketService  {
    private socket = io(URL);
    constructor() { }

    joinRoom(conversation: string) {
        this.socket.emit('join', conversation);
    }

    sendMessage(msg) {
        this.socket.emit('message', msg);
    }

    leaveRoom() {
        this.socket.emit('leave', null);
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

    messageRecieved() {
        const observable = new Observable<Message>(observer => {
            this.socket.on('message', (msg) => {
                observer.next(msg);
            });
            return () => this.socket.disconnect();
        });
        return observable;
    }
}
