import { Injectable } from '@angular/core';
import { ApiDriver } from '../interfaces/api-driver';
import { Person } from '../interfaces/person';
import { HutangForm, PartialHutangForm } from '../interfaces/hutang-form';
import { StateManagementService } from '../services/state-management.service';
import { CalendarUtilService } from '../calendar-utilities/calendar-util.service';
import { AuthService } from '../auth.service';
import { UpstashResponse } from '../interfaces/interface.upstash';

@Injectable({ providedIn: 'root' })
export class UpscaleRedisDriverService implements ApiDriver {
  db_name = 'upstash-redis';
  base_url = 'https://firm-goblin-25046.upstash.io';
  token = 'AWHWAAIjcDFjZjBjYmNlM2FhZjM0MThkODM1ODQ5YmJiYWQ0Yzg5ZXAxMA';

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

  private async redisCommand(cmd: string[], raw = false): Promise<Response> {
    const res = await fetch(this.base_url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cmd }),
    });
    return res;
  }

  async fetchPeopleNoAuth(): Promise<Person[]> {
    const keysResponse = await fetch(`${this.base_url}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(['KEYS', 'person:*'])
    });

    // const keysResponse = await this.redisCommand(['KEYS', 'person:*']);

    if (!keysResponse.ok) {
      return [];
    }

    const keysData = await keysResponse.json() as UpstashResponse;
    const keys = keysData.result;
    if (!Array.isArray(keys)) {
      return [];
    }

    const valuesResponse = await fetch(`${this.base_url}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(['MGET', ...keys])
    });

    if (!valuesResponse.ok) {
      return [];
    }

    const valuesData = await valuesResponse.json() as UpstashResponse;
    const valuesResultAsArray = valuesData.result;

    if (!Array.isArray(valuesResultAsArray)) {
      return [];

    }
    const people = valuesResultAsArray.map((data: any): Person => JSON.parse(data));
    return people;
  }

  async postPerson(_person: Partial<Person>) {
    const person: Person = {
      id: _person.id ? _person.id : crypto.randomUUID(),
      name: _person.name?.toLowerCase() || `no_name_${crypto.randomUUID()}`,
      createdBy: this.state.getName(),
    };
    const key = `person:${person.id}`;
    const response = await fetch(`${this.base_url}/set/${key}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(person)
    });

    // const result: UpstashResponse = await response.json();
    if (!response.ok) {
      // something went wrong...
      return {
        data: null,
        ok: false,
        message: 'not ok'
      }
    }

    return {
      data: person,
      ok: true,
      message: 'ok!'
    }
  }

  async deletePerson(id: string): Promise<boolean> {
    const key = "person:" + id;
    const response = await fetch(this.base_url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(['DEL', key])
    });

    if (!response.ok) {
      return false;
    }
    return true;
  }

  async updatePerson(oldPerson: Person, updateDetails: Partial<Person>) {


    const response = await fetch(`${this.base_url}/set/person:${oldPerson.id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateDetails)
    });

    if (!response.ok) {
      return this.errorResponse;
    }

     //TODO AFTER Upload to server  : update also  pemberiHutang  pemnerima hutang, hutang under person name  ( suggest : getALLHUTANG then map if same old person name else return biasa then2 update every hutang one by one )

    await this.updateHutangWhenUpdatePerson(oldPerson, updateDetails);

    return {
      message: 'ok!',
      ok: true,
      data: null,
    }
  }

  async updateHutangWhenUpdatePerson(oldPerson: Person, person: Partial<Person>) {
    if (!person.name) {
      return this.errorResponse;
    }

    const hutangsOfThisPerson = await this.getHutang(oldPerson)
    if (!Array.isArray(hutangsOfThisPerson)) {
      return this.errorResponse;
    }
    if (hutangsOfThisPerson.length === 0) {
      return this.errorResponse;
    }

    hutangsOfThisPerson.forEach(async (h) => {
      await this.updateHutang(h.id, { ...h, createdBy: person.name });
    });
//xxx
    return;
  }

  async postHutang(newHutangForm: PartialHutangForm): Promise<Response> {
    const now = new Date().toISOString();

    const hutang: HutangForm = {
      id: crypto.randomUUID(),
      hutangAmount: newHutangForm?.hutangAmount,
      pemberiHutang: newHutangForm?.pemberiHutang,
      penerimaHutang: newHutangForm?.pemberiHutang,
      description: newHutangForm?.description,
      location: newHutangForm?.location,
      updatedAt: newHutangForm?.updatedAt,
      updatedBy: newHutangForm?.updatedBy,
      createdBy: this.state.getName(),
      status: newHutangForm?.status || 'active',
      date: now,
      jsonDate: this.calendar.jsonDateExtractedFromIsoDate(now) as any,
      createdAt: now,
      jsonDateCreatedAt: this.calendar.jsonDateExtractedFromIsoDate(now) as any,
    };

    // const all = await this.getAllHutang();
    // const updated = [...all, hutang];

    const key = `hutang:${hutang.id}`;

    const response = await fetch(`${this.base_url}/set/${key}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(hutang)
    });
    return response;

  }

  async getHutang(person: Person) {
    // getHutangArrayByPerson
    const name = person.name;

    const keysResponse = await fetch(`${this.base_url}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(['KEYS', 'hutang:*'])
    });

    const keysData = await keysResponse.json();
    //? example "result": ["hutang:1001", "hutang:1002", "hutang:1003"]
    const keyIds = keysData.result;
    if (!Array.isArray(keyIds)) {
      return [];
    }

    const hutangValuesResponse = await fetch(`${this.base_url}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(['MGET', ...keyIds])
    });

    if (!hutangValuesResponse.ok) {
      return [];
    }

    const valuesData = await hutangValuesResponse.json();
    const allHutangArrayRaw: any[] = valuesData.result;
    const allHutangArray: HutangForm[] = allHutangArrayRaw.map(v => JSON.parse(v));
    return allHutangArray.filter(v => v.createdBy === name);

  }

  async getAllHutang(): Promise<HutangForm[]> {
    const name = this.state.getName();
    const isSuper = this.auth.isAuthSuper().status;

    const keysResponse = await fetch(`${this.base_url}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(['KEYS', 'hutang:*'])
    });

    const keysData = await keysResponse.json();
    //? example "result": ["hutang:1001", "hutang:1002", "hutang:1003"]
    const keyIds = keysData.result;
    if (!Array.isArray(keyIds)) {
      return [];
    }

    const hutangValuesResponse = await fetch(`${this.base_url}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(['MGET', ...keyIds])
    });

    if (!hutangValuesResponse.ok) {
      return [];
    }

    const valuesData = await hutangValuesResponse.json();
    const allHutangArrayRaw: any[] = valuesData.result;
    const allHutangArray: HutangForm[] = allHutangArrayRaw.map(v => JSON.parse(v));
    if (isSuper) {
      return allHutangArray;
    }
    return allHutangArray.filter(v => v.createdBy === name);
  }

  async updateHutang(id: string, updateDetails: HutangForm): Promise<boolean> {
    const updatedHutang = updateDetails;
    const response = await fetch(`${this.base_url}/set/hutang:${id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedHutang)
    });
    if (!response.ok) {
      return false;
    }
    return true;
  }

  async deleteHutang(id: string): Promise<boolean> {
    const key = "hutang:" + id;
    const response = await fetch(this.base_url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(['DEL', key])
    });

    if (!response.ok) {
      return false;
    }
    return true;

  }

}
