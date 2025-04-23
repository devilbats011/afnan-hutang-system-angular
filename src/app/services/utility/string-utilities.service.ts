import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StringUtilitiesService {

  capitalizeFirstWordLetterLowercaseRest(sentences: string): string {
    if(!sentences) {
      return '';
    }
    const words = sentences.split(' ');
    const capitalizedString = words.map(word => {
      // Capitalize the first letter and lowercase the rest of the letters
      const w = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      return w;
    }).join(' ');
    return capitalizedString;
  }

  compareTwoStringsIgnoreCase(string1: string, string2: string): boolean {

    if(!string1 || !string2) {
      return false;
    }
    return string1.toLowerCase() === string2.toLowerCase();

  }
}
