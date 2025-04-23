import { Component, Input } from '@angular/core';
import { HutangForm } from '../interfaces/hutang-form';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-hutang',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './view-hutang.component.html',
  styleUrl: './view-hutang.component.scss'

})
export class ViewHutangComponent {
 @Input() hutang!: HutangForm;

}
