import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonComponent } from "../person/person.component";
import { RestApiService } from '../services/rest-api.service';
import { Person } from '../interfaces/person';
import { PeopleUtilService } from './people-utilities/people-util.service';

@Component({
  selector: 'app-people',
  standalone: true,
  imports: [CommonModule, PersonComponent],
  template: `
<div class="people-list">
  <h2>People</h2>
  <ul>
    <li *ngFor="let person of this.peopleService.people()">
      <app-person [person]="person" ></app-person>
    </li>
  </ul>
</div>
  `,
  styleUrl: './people.component.scss'
})

export class PeopleComponent {

  restApiService = inject(RestApiService);
  peopleService = inject(PeopleUtilService);

  ngOnInit() {
    (async () => {
     this.peopleService.people.set(await this.restApiService.dropdownPeople());
    })();
  }

}
