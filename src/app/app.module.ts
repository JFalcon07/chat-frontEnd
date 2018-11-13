import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { URL } from './config';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppMaterialModule } from './app-material/app-material.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ChatComponent } from './chat/chat.component';
import { SettingsComponent } from './settings/settings.component';
import { AddModalComponent } from './add-modal/add-modal.component';
import { DashboardService } from './dashboard/dashboard.service';
import { Logged } from './login/login.service';
import { LoginGuardService } from './login-guard.service';
import { WebsocketService } from './wSocket.service';
import { ConversationModalComponent } from './conversation-modal/conversation-modal.component';

const routes: Routes = [
  {path: '', redirectTo: 'chat', pathMatch: 'full'},
  {path: 'chat', component: DashboardComponent, canActivate: [ LoginGuardService ]},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'chat/:id', component: DashboardComponent, canActivate: [ LoginGuardService ]}
];


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    SidebarComponent,
    ChatComponent,
    SettingsComponent,
    AddModalComponent,
    ConversationModalComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    AppMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule
  ],
  entryComponents: [AddModalComponent, ConversationModalComponent],
  providers: [
    CookieService,
    DashboardService,
    Logged,
    LoginGuardService,
    WebsocketService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
