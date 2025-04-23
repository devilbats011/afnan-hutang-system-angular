import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CalendarComponent } from './calendar/calendar.component';
import { authGuard } from './auth.guard';
import { redirectIfLoggedInGuard } from './redirect-if-logged-in.guard';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', component: LoginComponent, canActivate: [redirectIfLoggedInGuard] },
  { path: 'calendar', component: HomeComponent, canActivate: [authGuard] },
];
