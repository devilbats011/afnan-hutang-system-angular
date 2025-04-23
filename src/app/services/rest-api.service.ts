
import { Injectable } from '@angular/core';

import { Person } from '../interfaces/person';
import { HutangForm, PartialHutangForm } from '../interfaces/hutang-form';
import { AuthService } from '../auth.service';
import { StringUtilitiesService } from './utility/string-utilities.service';
import { StateManagementService } from './state-management.service';
import { JsonServerDriverService } from '../drivers/json-server-driver.service';
import { ApiDriver, ResponsePerson } from '../interfaces/api-driver';
import { UpscaleRedisDriverService } from '../drivers/upscale-redis-driver.service';

@Injectable({ providedIn: 'root' })
export class RestApiService {

  constructor(
    private jsonDriver: JsonServerDriverService,
    private redisDriver: UpscaleRedisDriverService,
    private authService: AuthService,
    private stringUtil: StringUtilitiesService,
    private state: StateManagementService,

  ) { }

  // public DB: 'json-server' | 'upscale-redis' = 'json-server';
  public DB: 'json-server' | 'upscale-redis' = 'upscale-redis';


  public getDBDriver(): ApiDriver {
    switch (this.DB) {
      case 'json-server':
        return this.jsonDriver;
      case 'upscale-redis':
        return this.redisDriver;
      default:
        throw new Error('Driver not implemented');
    }
  }

  async submitPerson(person: Person): Promise<ResponsePerson> {
    return await this.getDBDriver().postPerson(person);
  }

  submitNewHutangForm(hutang: PartialHutangForm) {
    this.getDBDriver().postHutang(hutang);
  }

  async attemptLogin(credentials: { name: string }): Promise<boolean> {
    const name = credentials.name.toLowerCase();
    if (name === this.authService.SUPER) return true;

    const people = await this.getDBDriver().fetchPeopleNoAuth();
    return !!people.find(p => this.stringUtil.compareTwoStringsIgnoreCase(name, p.name));
  }

  async dropdownPeople(): Promise<Person[]> {
    const people = await this.getDBDriver().fetchPeopleNoAuth();
    const ppl = this.authService.addSuperPersonHandler(people);
    if (this.authService.isAuthSuper().status) return ppl;
    return ppl.filter(p => p.name === this.authService.SUPER || p.createdBy === this.state.getName());
  }
}
