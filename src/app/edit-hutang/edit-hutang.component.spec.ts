import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHutangComponent } from './edit-hutang.component';

describe('EditHutangComponent', () => {
  let component: EditHutangComponent;
  let fixture: ComponentFixture<EditHutangComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditHutangComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditHutangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
