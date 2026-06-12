import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { OtpComponent } from './otp.component';

describe('OtpComponent', () => {
  let component: OtpComponent;
  let fixture: ComponentFixture<OtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtpComponent, TranslateModule.forRoot()],
      // OtpComponent redirects to /login when no email is stored, so the
      // route must exist to avoid an unhandled router rejection.
      providers: [provideHttpClient(), provideRouter([{ path: 'login', children: [] }])],
    }).compileComponents();

    fixture = TestBed.createComponent(OtpComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
