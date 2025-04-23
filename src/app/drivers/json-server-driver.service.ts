import { Injectable } from '@angular/core';
import { ApiDriver, ResponsePerson } from '../interfaces/api-driver';
import { Person } from '../interfaces/person';
import { HutangForm, PartialHutangForm } from '../interfaces/hutang-form';
import { StateManagementService } from '../services/state-management.service';
import { CalendarUtilService } from '../calendar-utilities/calendar-util.service';
import { AuthService } from '../auth.service';

@Injectable({ providedIn: 'root' })
export class JsonServerDriverService implements ApiDriver {
  db_name = 'json-server';
  base_url = 'http://localhost:3000/';
  addPersonUrl = this.base_url + 'people';

  constructor(
    private state: StateManagementService,
    private calendar: CalendarUtilService,
    private auth: AuthService
  ) { }

  errorResponse = {
    message: 'ok!',
    ok: true,
    data: null,
  }

  async fetchPeopleNoAuth(): Promise<Person[]> {
    try {
      const res = await fetch(this.base_url + 'people');
      return await res.json();
    } catch {
      return [];
    }
  }

  async postPerson(_person: Partial<Person>) {
    const person = {
      ..._person,
      id: crypto.randomUUID(),
      name: _person.name?.toLowerCase() || `no_name_${crypto.randomUUID()}`,
      createdBy: this.state.getName(),
    };

    const response = await this.auth.authFecthJson({
      url: this.addPersonUrl,
      method: 'POST',
      body: person,
    });

    if (!response.ok) {
      return {
        data: null,
        ok: false,
        message: 'not ok',
      }
    }

    return {
      data: person,
      ok: true,
      message: 'ok!',
    };

  }

  async deletePerson(id: string): Promise<boolean> {
    return this.auth.authFecthJson({
      url: this.base_url + 'people/' + id,
      method: 'DELETE',
    }).then(() => true).catch(() => false);
  }

  async updatePerson(oldPerson: Person, updateDetails: Partial<Person>) {
    const response = await this.auth.authFecthJson({
      url: this.base_url + 'people/' + oldPerson.id,
      method: 'PATCH',
      body: updateDetails,
    });

    if (!response.ok) {
      return { data: null, message: 'not ok', ok: false };
    }

    this.updateHutangWhenUpdatePerson(oldPerson, updateDetails)

    return {
      message: 'ok!',
      ok: true,
      data: null,
    }
  }

  async updateHutangWhenUpdatePerson(oldPerson: Person, person: Partial<Person>) {
    if (!person.name) {
      return;
    }

    const hutangsOfThisPerson = await this.getHutang(oldPerson)
    console.log(hutangsOfThisPerson,'hhttp');
    if (!Array.isArray(hutangsOfThisPerson)) {
      return;
    }

    if (hutangsOfThisPerson.length === 0) {
      return;
    }

    console.log(hutangsOfThisPerson,'hhh');

    hutangsOfThisPerson.forEach(async (h) => {
      await this.updateHutang(h.id,{ ...h, createdBy: person.name });
    });

    return;
  }

  async postHutang(newHutangForm: PartialHutangForm): Promise<Response> {
    const now = new Date().toISOString();
    const hutang = {
      ...newHutangForm,
      id: crypto.randomUUID(),
      createdBy: this.state.getName(),
      status: newHutangForm?.status || 'active',
      date: now,
      jsonDate: this.calendar.jsonDateExtractedFromIsoDate(now),
      createdAt: now,
      jsonDateCreatedAt: this.calendar.jsonDateExtractedFromIsoDate(now),
    };

    return await fetch(this.base_url + 'hutang', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hutang),
    });
  }

  async getHutang(person: Person): Promise<HutangForm[]> {
    const res = await fetch(this.base_url + `hutang?createdBy=${person.name}`);
    const data: HutangForm[] = await res.json();

    if (!this.auth.isAuthSuper().status) {
      return data.filter(h => h.createdBy === this.state.getName());
    }

    return data;
  }

  async getAllHutang(): Promise<HutangForm[]> {
    const name = this.state.getName();
    const isSuper = this.auth.isAuthSuper().status;
    const query = isSuper ? 'hutang' : `hutang?createdBy=${name}`;
    const res = await fetch(this.base_url + query);
    return await res.json();
  }

  async updateHutang(id: string, updateDetails: HutangForm): Promise<boolean> {
    const res = await this.auth.authFecthJson({
      url: this.base_url + 'hutang/' + id,
      method: 'PATCH',
      body: updateDetails,
    });
    return res.ok ? true : false;

  }

  async deleteHutang(id: string): Promise<boolean> {
    return this.auth.authFecthJson({
      url: this.base_url + 'hutang/' + id,
      method: 'DELETE',
    }).then(() => true).catch(() => false);
  }
}
