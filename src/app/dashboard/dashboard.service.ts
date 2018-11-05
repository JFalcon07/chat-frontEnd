import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DashboardService {
    private conversationSource = new BehaviorSubject({});
    currentConversation = this.conversationSource.asObservable();
constructor() { }

changeConversation(conversation) {
    this.conversationSource.next(conversation);
  }
}
