import { inject, Injectable, Injector, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RestApiService } from './services/rest-api.service';
import { StateManagementService } from './services/state-management.service';
import { Person } from './interfaces/person';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private injector: Injector, public router: Router) { }
  // router = inject(Router);
  private _restApiService!: RestApiService;
  stateManagementService = inject(StateManagementService);
  // restApiService = inject(RestApiService);
  get restApiService(): RestApiService {
    if (!this._restApiService) {
      this._restApiService = this.injector.get(RestApiService);
    }
    return this._restApiService;
  }

  SUPER = 'super';

  name = signal<any>(null);

  login_isErrorName = signal<boolean>(false);

  createLoginForm() {
    return new FormGroup({
      name: new FormControl('', [Validators.required]),
    });
  }

  isLoggedIn(): boolean {
    return this.stateManagementService.isBrowser() ? !!localStorage.getItem('login_name') : false;
  }

  async attemptLogin(credentials: { name: string }): Promise<boolean> {
    return await this.restApiService.attemptLogin(credentials)
  }

  async login(name: any) {
    const nameLowerCase = String(name).toLowerCase();
    localStorage.setItem('login_name', nameLowerCase);
    this.name.set(nameLowerCase);

    const people = await this.restApiService.dropdownPeople();
    this.stateManagementService.setPeople(people);

    this.router.navigate(['/calendar']);

  }

  logout() {
    localStorage.removeItem('login_name');
    this.name.set(null);
    this.router.navigate(['/']);
  }

  isAuthSuper(): { message: string, status: boolean } {
    const name = this.stateManagementService.getName();
    if (name?.toLowerCase() !== this.SUPER) {
      return { message: 'unauthorize', status: false };
    }
    else return { message: '', status: true };
  }

  isAuth(): { message: string, status: boolean } {
    const name = this.stateManagementService.getName();
    if (!name) {
      return { message: 'unauthorize', status: false };
    }
    else return { message: '', status: true };
  }

  async authFecthJson(
    { url, method = "GET", headers = {}, body }: {
      url: string;
      method?: string;
      headers?: Record<string, string>;
      body?: any;
    }): Promise<Response> {

    if (!this.isAuth().status) {
      return Promise.reject(null);
    }

    return fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers
      },
      body: body !== undefined ? JSON.stringify(body) : undefined
    });
  }

  addSuperPersonHandler(ppl : Person[]): Person[] {
    const personSuper = ppl.find(p => String(p.name).toLowerCase() === this.SUPER);
    if (!personSuper) {
      ppl.push({
        id: '0',
        name: 'super',
        createdBy: 'super',
      });
      return ppl;
    }
    return ppl;
  }
}
