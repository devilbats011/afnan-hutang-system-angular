import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewHutangComponent } from './view-hutang.component';

describe('ViewHutangComponent', () => {
  let component: ViewHutangComponent;
  let fixture: ComponentFixture<ViewHutangComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewHutangComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewHutangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
