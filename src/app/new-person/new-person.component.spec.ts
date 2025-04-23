import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewPersonComponent } from './new-person.component';
import { ToastrService } from 'ngx-toastr';
import { RestApiService } from '../services/rest-api.service';
import { NO_ERRORS_SCHEMA } from '@angular/core'; // Optional, helps if template has unknown elements

describe('NewPersonComponent', () => {
  let component: NewPersonComponent;
  let fixture: ComponentFixture<NewPersonComponent>;

  const mockToastr = {
    error: jasmine.createSpy('error'),
    success: jasmine.createSpy('success')
  };

  const mockRestApiService = {
    submitPerson: jasmine.createSpy('submitPerson')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NewPersonComponent],
      providers: [
        { provide: ToastrService, useValue: mockToastr },
        { provide: RestApiService, useValue: mockRestApiService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NewPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call toastr.error if name is duplicated', async () => {
    spyOn(component, 'validateIsDuplicated').and.returnValue(true);

    await component.submitPerson({ name: 'duplicate' });

    expect(mockToastr.error).toHaveBeenCalledWith('Name must be unique.', 'Duplicated name');
    expect(mockRestApiService.submitPerson).not.toHaveBeenCalled();
  });
});
