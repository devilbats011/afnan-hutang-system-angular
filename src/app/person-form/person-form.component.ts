import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, input, OnInit, Output, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { RestApiService } from '../services/rest-api.service';
import { Person } from '../interfaces/person';
import { ToastrService } from 'ngx-toastr';
import { InputValidateRequiredDirective } from '../directives/input-validate-required.directive';
import { ArrayUtilitiesService } from '../services/utility/array-utilities.service';
import { AuthService } from '../auth.service';
import { StateManagementService } from '../services/state-management.service';
import { StringUtilitiesService } from '../services/utility/string-utilities.service';
import { PeopleUtilService } from '../people/people-utilities/people-util.service';

@Component({
  selector: 'app-person-form',
  imports: [CommonModule, ReactiveFormsModule, InputValidateRequiredDirective],
  standalone: true,
  template: `
  <div class="container" >
    <form [formGroup]="formPerson" (submit)="submitPersonForm()" class="person-form">

      <div class="group-form">
        <label for="name"
          *ngIf="isLabelName"
         > Name </label>
        <input id="name" type="text" formControlName="name"
          appInputValidateRequired
          [placeholder]="(person && person.name) ?  person.name : ''"
        >
      </div>
      <button type="submit" class="person-form-submit-btn"> {{ submitButtonName }} </button>
      <div *ngIf="typeForm === 'edit'" >
        <button type="button" class="person-form-delete-btn" (click)="deletePerson()" > Delete </button>
      </div>
    </form>
  </div>
  `,
  styleUrl: './person-form.component.scss'
})
export class PersonFormComponent implements OnInit {
  restApiService = inject(RestApiService);
  @Input() person!: Partial<Person>;
  @Input() submitButtonName: string = "Submit";
  @Input() isLabelName: boolean = true;
  @Input() typeForm: 'edit' | 'create' = 'create';

  @Output() submitForm = new EventEmitter<any>();

  toastr = inject(ToastrService);
  arrayUtilService = inject(ArrayUtilitiesService);
  authService = inject(AuthService);
  stringUtilitiesService = inject(StringUtilitiesService);
  peopleService = inject(PeopleUtilService);
  stateManagementService = inject(StateManagementService);

  constructor() { }

  errorMessageName = signal<string>("Form Required");

  formPerson = new FormGroup({
    name: new FormControl(''),
    id: new FormControl(''),
    createdBy: new FormControl(''),
  });

  async deletePerson() {
    this.deletePersonManager();
  }

  private deletePersonManager() {
    if (this.stringUtilitiesService.compareTwoStringsIgnoreCase(this.person.name ?? '', this.authService.SUPER)) {
      this.toastr.error("Can't delete Super User", 'Delete error');
      return;
    }
    if (this.stringUtilitiesService.compareTwoStringsIgnoreCase(this.person.name ?? '', this.stateManagementService.getName())) {
      this.toastr.error("Can't delete Yourself..", 'Delete error');
      return;
    }
    this.typeFormProvider[this.typeForm]?.deletePerson?.();
  }

  private typeFormProvider: { [key: string]: { deletePerson?: () => Promise<void> } } = {
    edit: {
      deletePerson: async () => {
        if(!confirm('Are you sure?')) {
          return;
        }

        const isValid = await this.deletePersonValidation();
        console.log('isv', isValid);
        if (!isValid) {
          return;
        }
        const isDelete = await this.restApiService.getDBDriver()?.deletePerson(this.person.id);

        if(isDelete) {
          this.peopleService.people.update((people) => people.filter(person => person.id !== this.person.id));
          this.toastr.warning("", 'User deleted');
        }
        else {
          this.toastr.error("Ops,something went wrong..", 'Error delete user');
        }
      }
    },
    create: {
      deletePerson: async () => {
        console.error('Create have no delete Person');
        return;
      }
    }
  }

  async deletePersonValidation(): Promise<boolean> {
    if (!this.person?.id) {
      console.error('No id', 'Person not found');
      return false;
    }
    const hutangArray = await this.restApiService.getDBDriver()?.getHutang(this.person as Person);
    if (this.arrayUtilService.validateBasicArray(hutangArray)) {
      this.toastr.error("Can't delete this person because they still have hutang(debt) records.", 'Delete error');
      return false;
    }
    return true;
  }

  ngOnInit() {
    this.formPerson.patchValue({
      name: this.person?.name ?? '',
      id: this.person?.id ?? '',
      createdBy: this.person?.createdBy ?? '',
    });
  }

  submitPersonForm() {
    if (this.formPerson.invalid) {
      this.toastr.error('Name is invalid!', 'Name Required');
      console.log(this.formPerson.get('name')?.errors); // Check what error(s) are present
      return;
    }
    // return;
    this.submitForm.emit(this.formPerson.value);
  }


}
