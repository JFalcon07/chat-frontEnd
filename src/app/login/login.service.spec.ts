import { TestBed } from '@angular/core/testing';

import { Logged } from './login.service';

describe('LoginService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Logged = TestBed.get(Logged);
    expect(service).toBeTruthy();
  });
});
