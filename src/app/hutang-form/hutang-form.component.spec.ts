import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HutangFormComponent } from './hutang-form.component';

describe('HutangFormComponent', () => {
  let component: HutangFormComponent;
  let fixture: ComponentFixture<HutangFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HutangFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HutangFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
