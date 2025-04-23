import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppComponent } from '../app.component';
import { AuthService } from '../auth.service';
import { StringUtilitiesService } from '../services/utility/string-utilities.service';

@Component({
  selector: 'app-login',
  standalone: true,
  styleUrl: './login.component.scss',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
   <div class="login-container">
   <form [formGroup]="formLogin"   (submit)="submitLogin()" >
     <div class="form-group">
       <label for="name" > Your Name</label>
       <input type="text"  id="name" placeholder="Enter your name"  formControlName="name" />
      </div>
      <button type="submit">Enter</button>
      <!-- <input type="submit" name="Enter"/> -->
    </form>

    <p *ngIf="!!authService.login_isErrorName()" style="color: red;">
      A name is required Or Record not found or Login Error
    </p>

    </div>
  `
})

export class LoginComponent {
  authService = inject(AuthService); // Inject AuthService

  formLogin: FormGroup; // Explicitly declare the form type
  app = inject(AppComponent);

  constructor(private router: Router) {
    this.formLogin = this.authService.createLoginForm(); // Initialize the form
  }

  async submitLogin() {
    const name = this.formLogin.get('name')?.value;
    const isValid = await this.submitLoginValidation(name)
    if(!isValid) {
      return;
    }
    this.authService.login(name);
  }

  private async submitLoginValidation(name : any) {
    if (!name || !this.formLogin.valid) {
      this.authService.login_isErrorName.set(true);
      return false;
    }
    const credentials = { name }
    const isLog = await this.authService.attemptLogin(credentials);
    if(!isLog) {
      this.authService.login_isErrorName.set(true);
      return false;
    }
    this.authService.login_isErrorName.set(false);
    return isLog;
  }
}
