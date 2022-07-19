import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MiscellaneousService {

  constructor() { }

 public addDays(date:Date, days:number) {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}
