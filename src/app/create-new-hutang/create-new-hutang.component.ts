import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { RestApiService } from '../services/rest-api.service';
import { PartialHutangForm } from '../interfaces/hutang-form';
import { StatusHutangService } from '../services/status-hutang.service';
import { AuthService } from '../auth.service';
import { HutangFormComponent } from "../hutang-form/hutang-form.component";
import { StateManagementService } from '../services/state-management.service';

@Component({
  selector: 'app-create-new-hutang',
  imports: [CommonModule, ReactiveFormsModule, HutangFormComponent],
  standalone: true,
  template: `
    <div
    class="new-hutang-container"
    >
      <h2>Create new hutang</h2>
      <app-hutang-form (submitForm)="submitForm($event)"></app-hutang-form>
    </div>
  `,
  styleUrl: './create-new-hutang.component.scss'
})
export class CreateNewHutangComponent {

  restApiService = inject(RestApiService);
  authService = inject(AuthService);
  stateManagementService = inject(StateManagementService);

  url = 'https://electric-humpback-57856.upstash.io';
  token = 'AeIAAAIjcDE0NDEzNWRhYjIzZGQ0YWUxYWJjYWMwMWZjMTBhODZhMHAxMA';

  data: Array<{ key: string, value: any }> = [];

  optionPersons = signal<{ name: any }[]>([]); // Using signal instead of a normal property

  constructor(private fb: FormBuilder) {
    const c = StatusHutangService.getStatusColor("active");
    // console.log(c, ' <-::color');
    this.loadPersons();
  }

  async loadPersons() {
    const dropdownPeople = await this.stateManagementService.getPeople;
    this.optionPersons.set(dropdownPeople);
  }

  newHutangForm = new FormGroup({
    createdBy: new FormControl(''),
    pemberiHutang: new FormControl(''),
    penerimaHutang: new FormControl(''),
    hutangAmount: new FormControl(''),
    description: new FormControl(''),
    location: new FormControl(''),
    date: new FormControl(''),
  });

  ngOnInit() {
    if (this.authService.isAuthSuper().status) {
      this.newHutangForm.get('createdBy')?.setValue('super');
    }
  }

  submitForm(hutangForm: PartialHutangForm) {
    console.log('new-hutang-submitForm-', hutangForm);
    if (!hutangForm) {
      console.error('hutangForm is undefined');
      return;
    }
    this.restApiService.submitNewHutangForm(hutangForm);
  }

}
