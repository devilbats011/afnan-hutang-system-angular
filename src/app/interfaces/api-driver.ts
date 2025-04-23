import { Person } from '../interfaces/person';
import { HutangForm, PartialHutangForm } from '../interfaces/hutang-form';

export interface ApiDriver {
  db_name: string;
  base_url: string;
  addPersonUrl?: string;

  fetchPeopleNoAuth(): Promise<Person[]>;
  postPerson(person: Partial<Person>): ResponsePerson;
  updatePerson(person: Person, updateDetails: Partial<Person>): ResponsePerson;
  deletePerson(id: string): Promise<boolean>;
  postHutang(hutang: PartialHutangForm): Promise<Response>;
  getHutang(person: Person): Promise<HutangForm[]>;
  getAllHutang(): Promise<HutangForm[]>;
  updateHutang(id: string, updateDetails: HutangForm): Promise<boolean>;
  deleteHutang(id: string): Promise<boolean>;
  updateHutangWhenUpdatePerson: any;
}

export interface ResponseData<TData, TMessage> {
  data: TData,
  message: TMessage,
  ok: boolean,
}

export type ResponsePerson = Promise<ResponseData<Person | null, any>>;

export interface Error { isError: boolean , optional: any }
