import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { StateManagementService } from './services/state-management.service';

class MockStateManagementService {
  getName = jasmine.createSpy();
}


describe('AuthService', () => {
  let service: AuthService;
  let mockState: MockStateManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: StateManagementService, useClass: MockStateManagementService }
      ]
    });

    service = TestBed.inject(AuthService);
    mockState = TestBed.inject(StateManagementService) as unknown as MockStateManagementService;
  });

  it('should return status true when name is "super"', () => {
    mockState.getName.and.returnValue('super');

    const result = service.isAuthSuper();
    expect(result).toEqual({ message: '', status: true });
  });

  it('should return status false when name is not "super"', () => {
    mockState.getName.and.returnValue('guest');

    const result = service.isAuthSuper();
    expect(result).toEqual({ message: 'unauthorize', status: false });
  });

  // it('should be created', () => {
  //   expect(service).toBeTruthy();
  // });
});
