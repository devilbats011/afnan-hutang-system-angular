import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AskPasswordPopupComponent } from './ask-password-popup.component';

describe('AskPasswordPopupComponent', () => {
  let component: AskPasswordPopupComponent;
  let fixture: ComponentFixture<AskPasswordPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AskPasswordPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AskPasswordPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
