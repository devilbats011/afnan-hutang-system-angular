import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { CalendarComponent } from '../calendar/calendar.component';
import { PeopleComponent } from "../people/people.component";
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { StateManagementService } from '../services/state-management.service';
import { StringUtilitiesService } from '../services/utility/string-utilities.service';
import { CreateNewHutangComponent } from "../create-new-hutang/create-new-hutang.component";
import { NewPersonComponent } from "../new-person/new-person.component";

@Component({
  selector: 'app-home',
  imports: [CommonModule,
    CalendarComponent,
    PeopleComponent,
    ReactiveFormsModule,
    CreateNewHutangComponent,
    NewPersonComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  stateManager = inject(StateManagementService);
  stringUtilService = inject(StringUtilitiesService);
  name = signal<string>('');

  ngOnInit() {
    const name = this.stringUtilService.capitalizeFirstWordLetterLowercaseRest(this.stateManager.getName());
    this.name.set(name);
  }

}
