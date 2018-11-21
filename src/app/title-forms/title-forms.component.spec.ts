import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleFormsComponent } from './title-forms.component';

describe('TitleFormsComponent', () => {
  let component: TitleFormsComponent;
  let fixture: ComponentFixture<TitleFormsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TitleFormsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TitleFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
