import { Injectable, effect, inject, signal } from '@angular/core';
import { Person } from '../../interfaces/person';
import { StateManagementService } from '../../services/state-management.service';

@Injectable({
  providedIn: 'root'
})
export class PeopleUtilService {
  people= signal<Person[]>([]);
  stateManagementService = inject(StateManagementService);
  constructor() {
    effect(() => {
      const ppl = this.people();
      this.stateManagementService.setPeople(ppl);
      // console.log(['change in people', this.people()]);
    });
  }
}
