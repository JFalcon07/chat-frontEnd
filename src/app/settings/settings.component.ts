import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

import { passwordmatcher } from '../register/register.service';
import { userInfo, languages, Language, ChangeRes} from '../config';
import { WebsocketService } from '../wSocket.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent implements OnInit {
  languages: Language[];
  username;
  language;
  usernameForm: FormControl;
  languageForm: FormControl;
  passwordForm: FormGroup = new FormGroup({
    password:  new FormControl ('', [Validators.required, Validators.minLength(4)]),
    passwordConfirm:  new FormControl('', [Validators.required]),
  }, {validators: passwordmatcher});
  constructor(
    private cookieService: CookieService,
    private webSocket: WebsocketService,
    private SnackBar: MatSnackBar,
    private translate: TranslateService) {
    this.usernameForm = new FormControl ('', Validators.required);
    this.languageForm = new FormControl();
  }
  get f() {
    return this.passwordForm.controls;
  }
  ngOnInit() {
    this.languages = languages;
    this.username = userInfo.username;
    this.getLanguage();
    this.webSocket.PasswordChanged()
    .subscribe((changeResponse: ChangeRes) => {
        if (changeResponse.changed) {
          this.translate.get('messages.PasswordChanged').subscribe(value => {
          this.SnackBar.open(value, undefined, {
            duration: 5000,
          });
        });
      }
      });
      this.webSocket.UsernameChanged()
      .subscribe((changeResponse: ChangeRes) => {
          if (changeResponse.changed) {
            if (changeResponse.user !== userInfo._id) { return false; }
            this.username = changeResponse.value;
          }
      });
      this.webSocket.LanguageChanged()
      .subscribe((changeResponse: ChangeRes) => {
        if (changeResponse.changed) {
          userInfo.language = changeResponse.value;
          this.getLanguage();
          this.translate.use(changeResponse.value);
        }
      });
    }
  getLanguage() {
    languages.forEach(element => {
      if (element.value === userInfo.language) {
        this.languageForm.setValue(element.value);
        this.language = element.viewValue;
      }
    });
  }
  createChange(change) {
    const data = {
      token: this.cookieService.get('token'),
      user: userInfo._id,
      change: change
    };
    return data;
  }
  changePassword() {
    if (!this.passwordForm.valid) {
      return this.translate.get('messages.invalid').subscribe(value => {
      this.SnackBar.open(value, undefined, {
        duration: 5000,
      });
    });
    } else {
      this.webSocket.changePassword(this.createChange(this.passwordForm.controls.password.value));
    }
  }
  changeUsername() {
    if (!this.usernameForm.valid) {
      return this.translate.get('messages.invalid').subscribe(value => {
        this.SnackBar.open(value, undefined, {
          duration: 5000,
        });
      });
    } else {
      this.webSocket.changeUsername(this.createChange(this.usernameForm.value));
    }
  }
  newLanguage() {
      this.webSocket.changeLanguage(this.createChange(this.languageForm.value));
  }
}
