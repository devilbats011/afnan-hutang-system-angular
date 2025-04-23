import { inject, Injectable, Injector, signal } from '@angular/core';
import { AuthService } from '../auth.service';
import { Person } from '../interfaces/person';
import { HutangForm, PartialHutangForm } from '../interfaces/hutang-form';
import { StateManagementService } from './state-management.service';
import { StringUtilitiesService } from './utility/string-utilities.service';
import { CalendarUtilService } from '../calendar-utilities/calendar-util.service';


@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  stateManagementService = inject(StateManagementService);
  stringUtilitiesService = inject(StringUtilitiesService);
  // authService = inject(AuthService);
  // router = inject(Router);
  calendarUtilService = inject(CalendarUtilService);

  constructor(private injector: Injector) { }
  private _authService!: AuthService;
  get authService(): AuthService {
    if (!this._authService) {
      this._authService = this.injector.get(AuthService);
    }
    return this._authService;
  }

  private DB = signal<string>('json-server');

  private JSON_SERVER = {
    db_name: 'json-server',
    base_url: 'http://localhost:3000/',
    addPersonUrl: 'http://localhost:3000/people',
    fetchPeopleNoAuth: () => this.JSON_SERVER_fetchPeopleNoAuth(),
    postPerson: async (person: Partial<Person>) => await this.JSON_SERVER_postPerson(person),
    updatePerson: (id: string, updateDetails: Partial<Person>) => this.JSON_SERVER_updatePersonById(id, updateDetails),
    deletePerson: async (id: string) : Promise<boolean> => await this.JSON_SERVER_deletePersonById(id),
    postHutang: (hutang: PartialHutangForm) => this.JSON_Server_postHutang(hutang),
    getHutang: (person: Person) => this.JSON_SERVER_getHutang(person),
    getAllHutang: () => this.JSON_SERVER_getAllHutang(),
    updateHutang: (id: string, updateDetails: PartialHutangForm) => this.JSON_SERVER_updateHutangById(id, updateDetails),
    deleteHutang: async (id: string) : Promise<boolean> => this.JSON_SERVER_deleteHutangById(id),
  }

  private UPSCALE_REDIS = {
    db_name: 'upscale-redis',
    base_url: '',
    addPersonUrl: '',
    fetchPeopleNoAuth: () => () => [],
    postPerson: async (person: Partial<Person>) => () => undefined,
    postHutang: (hutang: PartialHutangForm) => () => undefined,
    getHutang: (person: Person) => () => undefined,
    getAllHutang: () => () => undefined,
    updateHutang: (id: string, updateDetails: PartialHutangForm) => () => undefined,
    deleteHutang: (id: string) => () => undefined,
    updatePerson: (id: string, updateDetails: Partial<Person>) => () => undefined,
    deletePerson: (id: string) => () => undefined,
  }

  getDBDriver() {
    switch (this.DB()) {
      case 'json-server':
        return this.JSON_SERVER;
      case 'upscale-redis':
        return this.UPSCALE_REDIS
      default:
        return undefined;
    }
  }

  getBaseUrl() {
    switch (this.DB()) {
      case 'json-server':
        return this.JSON_SERVER.base_url
      case 'upscale-redis':
        return this.UPSCALE_REDIS.base_url
      default:
        return '';
    }
  }

  getAddPersonURL() {
    switch (this.DB()) {
      case 'json-server':
        return this.JSON_SERVER.addPersonUrl
      case 'upscale-redis':
        return this.UPSCALE_REDIS.addPersonUrl
      default:
        return '';
    }
  }

  async submitPerson(person: Person): Promise<Person> {
    return await this.getDBDriver()?.postPerson(person) as Person;
  }

  submitNewHutangForm(newHutangForm: PartialHutangForm) {
    (async () => {
      await this.getDBDriver()?.postHutang(newHutangForm);
    })()
  }

  private async JSON_Server_postHutang(newHutangForm: PartialHutangForm) {
    const hutang: PartialHutangForm = { ...newHutangForm };
    hutang.id = crypto.randomUUID();
    hutang.createdBy = this.stateManagementService.getName() as string;
    hutang.status = hutang.status || 'active';
    hutang.date = new Date().toISOString();
    hutang.jsonDate = this.calendarUtilService.jsonDateExtractedFromIsoDate(hutang.date);
    hutang.createdAt = new Date().toISOString();
    hutang.jsonDateCreatedAt = this.calendarUtilService.jsonDateExtractedFromIsoDate(hutang.createdAt);

    return await fetch('http://localhost:3000/hutang', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(hutang),
    });
  }

  private async JSON_SERVER_getHutang(person: Person): Promise<HutangForm[]> {
    // pemberiHutang
    const url =  'hutang?createdBy=' + person.name;
    // const url = !this.authService.isAuthSuper().status ? : 'hutang';
    const res = await fetch(this.getBaseUrl()+url, {
      method: "GET",
    })
      .then(response => response.json())
      .then(data => data)
      .catch(error => console.error('Error fetching people:', error));

    if (!res) {
      return [];
    }
    //if user is not super, filter record that not related to the user, else if user is super, shown the records anyways
    if(!this.authService.isAuthSuper().status) {
      return res.filter((hutang: HutangForm) => {
        if(hutang.createdBy === this.stateManagementService.getName()) {
          return true;
        }
        return false;
      });
    }
    return res as unknown as HutangForm[];
  }

  private async JSON_SERVER_getAllHutang(): Promise<HutangForm[]> {

    const url =  !this.authService.isAuthSuper().status ? 'hutang?createdBy='+this.stateManagementService.getName() : 'hutang';
    const res = await fetch(this.getBaseUrl()+url, {
      method: "GET",
    })
      .then(response => response.json())
      .then(data => data)
      .catch(error => console.error('Error fetching people:', error));

    if (!res) {
      return [];
    }

    return res as unknown as HutangForm[];
  }

  private async JSON_SERVER_postPerson(_person: Partial<Person>) {
    const person = { ..._person };
    person.id = crypto.randomUUID();
    person.name = !!person.name ? person.name?.toLocaleLowerCase() : 'no_name_'+person.id;
    console.log(person.name);
    person.createdBy = this.stateManagementService.getName() as string;
    await this.authService.authFecthJson({
      url: this.JSON_SERVER.addPersonUrl,
      method: "POST",
      body: person
    }).then((res: Response | null) => {
      return res;
    });
    return person;
  }

  private async JSON_SERVER_deleteHutangById(id: string) : Promise<boolean> {
    return this.authService.authFecthJson({
      url: this.getBaseUrl() + 'hutang/' + id,
      method: "DELETE",
    }).then((res)=> true).catch((err)=>false);
  }

  private async JSON_SERVER_deletePersonById(id: string) : Promise<boolean> {
    return this.authService.authFecthJson({
      url: this.getBaseUrl() + 'people/' + id,
      method: "DELETE",
    }).then((res)=> true).catch((err)=>false);
  }


  private async JSON_SERVER_updatePersonById(id: string, updateDetails: Partial<Person>) {
    this.authService.authFecthJson({
      url: this.getBaseUrl() + 'people/' + id,
      method: "PATCH",
      body : updateDetails
    })
  }

  private async JSON_SERVER_updateHutangById(id: string, updateDetails: PartialHutangForm) {
    this.authService.authFecthJson({
      url: this.getBaseUrl() + 'hutang/' + id,
      method: "PATCH",
      body : updateDetails
    })
  }

  async attemptLogin(credentials: { name: string }): Promise<boolean> {
    const credentialsName = String(credentials.name).toLowerCase();
    if (credentialsName === this.authService.SUPER) {
      return true;
    }
    const people = await this.getDBDriver()?.fetchPeopleNoAuth?.() as Person[];
    const person = people.find((_person) => this.stringUtilitiesService.compareTwoStringsIgnoreCase(credentialsName, _person.name));
    // const person = people.find((_person)=> credentialsName === String(_person.name).toLowerCase());
    return !!person ? true : false;
  }

  private async JSON_SERVER_fetchPeopleNoAuth(): Promise<Person[]> {
    const res = await fetch(this.getBaseUrl() + 'people', {
      method: "GET",
    })
      .then(response => response.json())
      .then(data => data)
      .catch(error => console.error('Error fetching people:', error));

    if (!res) {
      return [];
    }
    const people = res as unknown as Person[];
    return people;
  }

  async dropdownPeople(): Promise<Person[]> {
    const people = await this.getDBDriver()?.fetchPeopleNoAuth?.() as Person[];

    const isAuth = this.authService.isAuthSuper();
    if (isAuth.status) {
      return people;
    }

    return people.filter((person) => {
      if (person.name === this.authService.SUPER) {
        return true;
      }
      return person.createdBy === this.stateManagementService.getName();
    });
  }

}
