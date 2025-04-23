import { inject, Injectable, Injector } from '@angular/core';
import { ArrayUtilitiesService } from './utility/array-utilities.service';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class StateManagementService {

  arrayUtilService = inject(ArrayUtilitiesService);

  // constructor(private injector: Injector) { }
  // private _authService!: AuthService;
  // get authService(): AuthService {
  //   if (!this._authService) {
  //     this._authService = this.injector.get(AuthService);
  //   }
  //   return this._authService;
  // }


  isBrowser() {
    return typeof window !== 'undefined';
  }



  getName(): string {
    return this.isBrowser() ? localStorage.getItem('login_name') || '' : '';
  }

  setName(name: string): void {
    if (this.isBrowser()) {
      localStorage.setItem('login_name', name);
    }
  }

  get getPeople(): any[] {
    const people = this.isBrowser() ? localStorage.getItem('people') || '' : '';
    const peopleArray: any[] = JSON.parse(people);
    if (!this.arrayUtilService.validateBasicArray(peopleArray)) {
      return [];
    }
    if (String(this.getName()).toLowerCase() === 'super') {
      const personSuper = peopleArray.find(p => String(p.name).toLowerCase() === 'super');
      if (!personSuper) {
        peopleArray.push({
          id: '0',
          name: 'super',
          createdBy: 'super',
        });
      }

    }
    return peopleArray;
  }

  setPeople(people: any): void {
    if (this.isBrowser()) {
      localStorage.setItem('people', JSON.stringify(people));
    }
  }

}
