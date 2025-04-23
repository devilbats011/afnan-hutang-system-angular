import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ArrayUtilitiesService {

  constructor() { }

  validateBasicArray<T>(array: T): boolean {
    if (!Array.isArray(array)) {
      // console.error('The provided value is not an array.');
      return false;
    }

    if (array.length === 0) {
      // console.error('The array is empty.');
      return false;
    }

    return true;
  }
}
