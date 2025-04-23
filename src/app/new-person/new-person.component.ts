import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RestApiService } from '../services/rest-api.service';
import { Person } from '../interfaces/person';
import { CommonModule } from '@angular/common';
import { PersonFormComponent } from "../person-form/person-form.component";
import { PeopleUtilService } from '../people/people-utilities/people-util.service';
import { StateManagementService } from '../services/state-management.service';
import { StringUtilitiesService } from '../services/utility/string-utilities.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-person',
  imports: [CommonModule, ReactiveFormsModule, PersonFormComponent],
  standalone: true,
  template: `
  <div class="new-person-container">
  <h2>Create New Person</h2>
    <app-person-form (submitForm)="submitPerson($event)"></app-person-form>
  </div>
  `,
  styleUrl: './new-person.component.scss'
})
export class NewPersonComponent {
  restApiService = inject(RestApiService);
  peopleService = inject(PeopleUtilService);
  stateManagementService = inject(StateManagementService);
  stringUtilService = inject(StringUtilitiesService);
  toastr = inject(ToastrService);

  formPerson = new FormGroup({
    name: new FormControl(''),
  });

  submitPerson(data: Partial<Person>) {
    (async () => {
      if (this.validateIsDuplicated(data)) {
        this.toastr.error('Name must be unique.', 'Duplicated name');
        return;
      }

      const newPerson = await this.restApiService.submitPerson(data as Person);

      if (!newPerson.ok) {
        this.toastr.error('', 'Ops something went wrong..');
      }

      this.toastr.success('', 'Person created.');

      this.peopleService.people.update(p => [...p, newPerson.data as Person ]);

    })();

  }

  validateIsDuplicated(data: Partial<Person>): boolean {
    const isDuplicate = this.peopleService.people().some((p) => {
      return this.stringUtilService.compareTwoStringsIgnoreCase(data.name || '', p.name);
    });
    return isDuplicate;
  }
}
