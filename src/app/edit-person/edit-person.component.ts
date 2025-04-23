import { Component, inject, Input } from '@angular/core';
import { Person } from '../interfaces/person';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PersonFormComponent } from "../person-form/person-form.component";
import { RestApiService } from '../services/rest-api.service';
import { PeopleUtilService } from '../people/people-utilities/people-util.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-person',
  imports: [CommonModule, ReactiveFormsModule, PersonFormComponent],
  template: `
    <app-person-form [submitButtonName]="'Update'" [typeForm]="'edit'" [isLabelName]="false" (submitForm)="submitForm($event)" [person]="person" ></app-person-form>
  `,
  styleUrl: './edit-person.component.scss'
})
export class EditPersonComponent {
  @Input() person!: Person;

  toaster = inject(ToastrService);
  restApiService = inject(RestApiService);
  peopleService = inject(PeopleUtilService);

  submitForm(person: Partial<Person>) {

    if (!person.id) {
      console.error('no person id');
    }

    this.restApiService.getDBDriver()?.updatePerson(this.person, person);
    const ppl = this.peopleService.people().map(p => ({ ...p }));
    const index =  ppl.findIndex((p)=> p.id == person.id);
    ppl[index].name = person.name as string;
    this.peopleService.people.set(ppl);
    this.toaster.success('Person updated');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
}
