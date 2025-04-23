import { CommonModule } from '@angular/common';
import { Component, inject, Input, signal } from '@angular/core';
import { Person } from '../interfaces/person';
import { ReactiveFormsModule } from '@angular/forms';
import { RestApiService } from '../services/rest-api.service';
import { HutangForm, HutangFormExtends } from '../interfaces/hutang-form';
import { EditHutangComponent } from '../edit-hutang/edit-hutang.component';
import { ViewHutangComponent } from "../view-hutang/view-hutang.component";
import { ViewPersonComponent } from "../view-person/view-person.component";
import { PersonUtilServiceService } from './person-util-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-person',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EditHutangComponent, ViewHutangComponent, ViewPersonComponent],
  templateUrl: './person.component.html',
  styleUrl: './person.component.scss'
})
export class PersonComponent {
  @Input() person!: Person;

  restApiService = inject(RestApiService);
  personUtilServiceService = inject(PersonUtilServiceService);
  toaster = inject(ToastrService);

  hutangArray = signal<HutangFormExtends[]>([]);
  isHutangExist = signal(false);

  hutangArrayExtend(hutangArray: HutangForm[]): HutangFormExtends[] {
    return hutangArray.map((hutangForm) => {
      return { ...hutangForm, isEditOpen: false };
    });
  }

  async deleteHutang(hutang : HutangFormExtends) {
    if(!hutang.id) {
      this.toaster.error('Ops,something went wrong','Hutang Undefined')
      return;
    }
    if (confirm("Are you sure you want to delete this hutang?")) {
      const isDelete = await this.restApiService.getDBDriver()?.deleteHutang(hutang.id);
      if(isDelete){
        this.hutangArray.update(hArray => hArray.filter(h => h.id !== hutang.id));
        this.toaster.success('','Hutang Deleted')
      }
    }
  }

  ngOnInit() {
    (async () => {
      const hutangArray = await this.restApiService.getDBDriver()?.getHutang(this.person);
      let isHutangExist = false;
      if (Array.isArray(hutangArray) && hutangArray.length > 0) {
        isHutangExist = true;
        const hutangArrayExtend = this.hutangArrayExtend(hutangArray);
        this.hutangArray.set(hutangArrayExtend);
      }
      this.isHutangExist.set(isHutangExist);
    })();
  }

}
