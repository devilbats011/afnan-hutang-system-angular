import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewHutangComponent } from './create-new-hutang.component';

describe('CreateNewHutangComponent', () => {
  let component: CreateNewHutangComponent;
  let fixture: ComponentFixture<CreateNewHutangComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateNewHutangComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNewHutangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
