import { Injectable, signal, WritableSignal } from '@angular/core';
import { HutangFormExtends } from '../interfaces/hutang-form';

@Injectable({
  providedIn: 'root'
})
export class PersonUtilServiceService {

  constructor() { }

  editOpenToggler(hutang: HutangFormExtends, hutangArray: WritableSignal<any[]>) {
    const _hutangArray = [...hutangArray()];
    const index = _hutangArray.findIndex((item) => item.id === hutang.id);
    if (index !== -1) {
      _hutangArray[index].isEditOpen = !_hutangArray[index].isEditOpen;
      hutangArray.set(_hutangArray);
    }
  }

}
