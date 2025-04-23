import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { RestApiService } from '../services/rest-api.service';
import { HutangForm, HutangFormExtends, PartialHutangForm } from '../interfaces/hutang-form';
import { StateManagementService } from '../services/state-management.service';
import { StatusHutangService } from '../services/status-hutang.service';
import { InputValidateRequiredDirective } from '../directives/input-validate-required.directive';

@Component({
  selector: 'app-hutang-form',
  imports: [CommonModule, ReactiveFormsModule,
    InputValidateRequiredDirective
  ],
  templateUrl: './hutang-form.component.html',
  styleUrl: './hutang-form.component.scss'
})
export class HutangFormComponent {
  restApiService = inject(RestApiService);
  authService = inject(AuthService);
  stateManagementService = inject(StateManagementService);
  // statusHutangService = inject(StatusHutangService);

  STATUS_LIST = signal<any[]>(StatusHutangService.STATUS_LIST);

  @Input() genericHutang! : HutangFormExtends | HutangForm | undefined | null ;
  @Input() submitButtonName: string = "Submit";
  @Input() typeForm!: 'edit' | 'create';

  @Output() submitForm = new EventEmitter<PartialHutangForm>();

  optionPersons = signal<{ name: any }[]>([]);

  constructor(private fb: FormBuilder) {
    //? this.loadPeople(); -> Load list of people into <select> dropdown
    this.loadPeople();
  }

  loadPeople() {
    const dropdownPeople = this.stateManagementService.getPeople;
    this.optionPersons.set(dropdownPeople);
  }

  newHutangForm = new FormGroup({
    createdBy: new FormControl(''),
    pemberiHutang: new FormControl(''),
    status: new FormControl(''),
    penerimaHutang: new FormControl(''),
    hutangAmount: new FormControl(''),
    description: new FormControl(''),
    location: new FormControl(''),
    date: new FormControl(''),
  });

  ngOnInit() {
    this.initInjectDataToGenericHutang();
    if (this.authService.isAuthSuper().status) {
      this.newHutangForm.get('createdBy')?.setValue('super');

    }
  }

  initInjectDataToGenericHutang() {
    if(this.genericHutang) {
      this.newHutangForm.get('pemberiHutang')?.setValue(this.genericHutang.pemberiHutang);
      this.newHutangForm.get('penerimaHutang')?.setValue(this.genericHutang.penerimaHutang);
      this.newHutangForm.get('hutangAmount')?.setValue(this.genericHutang.hutangAmount);
      this.newHutangForm.get('status')?.setValue(this.genericHutang.status);
      this.newHutangForm.get('description')?.setValue(this.genericHutang.description);
      this.newHutangForm.get('location')?.setValue(this.genericHutang.location);
      this.newHutangForm.get('date')?.setValue(this.genericHutang.date);
      this.newHutangForm.get('createdBy')?.setValue(this.genericHutang.createdBy);

    }
  }

  submitHutangForm() {
    this.submitForm.emit(this.newHutangForm.value as any);
  }

}
