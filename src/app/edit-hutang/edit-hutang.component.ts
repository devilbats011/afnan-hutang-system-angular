import { Component, inject, Input } from '@angular/core';
import { HutangForm, HutangFormExtends, PartialHutangForm } from '../interfaces/hutang-form';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HutangFormComponent } from "../hutang-form/hutang-form.component";
import { RestApiService } from '../services/rest-api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-hutang',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HutangFormComponent],
  templateUrl: './edit-hutang.component.html',
  styleUrl: './edit-hutang.component.scss'
})
export class EditHutangComponent {
  @Input() hutangExtends!: HutangFormExtends;

  restApiService = inject(RestApiService);
  toaster = inject(ToastrService);

  async submitForm(data: PartialHutangForm) {
    const hutangData: HutangFormExtends = { ...this.hutangExtends, ...data }
    if (!hutangData) {
      return;
    }
    //? Delete any unnecessary  property to update to db
    delete hutangData.isEditOpen;

    const isUpdate = await this.restApiService.getDBDriver()?.updateHutang(this.hutangExtends.id, hutangData);
    isUpdate ? this.toaster.success('Hutang updated') : this.toaster.error('Hutang update Error ');

    setTimeout(() => {
      window.location.reload();
    }, 1000);

  }
}
