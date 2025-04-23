import { Component, inject, Input, signal } from '@angular/core';
import { Person } from '../interfaces/person';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RestApiService } from '../services/rest-api.service';
import { AuthService } from '../auth.service';
import { StringUtilitiesService } from '../services/utility/string-utilities.service';
import { EditPersonComponent } from "../edit-person/edit-person.component";

@Component({
  selector: 'app-view-person',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EditPersonComponent],
  template: `
    <div class="person-card">
      <div class="name-img" > {{ avatarName() }}</div>
      <h3 *ngIf="!isEditOpen(); else x" >{{ person.name }}</h3>
      <ng-template #x>
      <app-edit-person [person]="person" > </app-edit-person>
      </ng-template>
      <button (click)="editToggler()" class="btn-edit" *ngIf="this.stringUtilService.compareTwoStringsIgnoreCase(person.name , this.authService.SUPER)  ? false : true">
        {{ isEditOpen() ? 'Back' : 'Delete' }}
      </button>
    </div>
  `,
  styleUrl: './view-person.component.scss'
})
export class ViewPersonComponent {
  @Input() person!: Person;
  restApiService = inject(RestApiService);
  authService = inject(AuthService);
  stringUtilService = inject(StringUtilitiesService);

  isEditOpen = signal<boolean>(false);
  avatarName = signal<string>("");

  getAvatarName(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase();
  }

  ngOnInit() {
    this.avatarName.set(this.getAvatarName(this.person.name));
  }

  editToggler() {
    this.isEditOpen.set(!this.isEditOpen());
  }

}
