import { Component, OnInit } from '@angular/core';
import { languages, Language, userInfo } from '../config';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-title-forms',
  templateUrl: './title-forms.component.html',
  styleUrls: ['./title-forms.component.css']
})
export class TitleFormsComponent implements OnInit {
  languages: Language[];
  language: FormControl;
  constructor(private translate: TranslateService) {
    this.language = new FormControl ('');
  }

  ngOnInit() {
    this.language.setValue(userInfo.language);
    this.translate.setDefaultLang(userInfo.language);
    this.languages = languages;
  }

  changeLanguage() {
    userInfo.language = this.language.value;
    this.translate.use(this.language.value);
  }

}
