import { Injectable } from '@angular/core';
import {Participant} from '../interfaces/participant';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  calculateToGoPerDay(): number {
    const today: Date = new Date();
    return this.checkDateAndCalculateDays(today)

  }

  checkDateAndCalculateDays(today: Date): number {
    return this.getRemainingDays(today);
  }

  calculateMeanToGo(user: Participant): number {
    return Number(((user?.gemeldet! - user?.bereitsZurueckgelegt!) / this.checkDateAndCalculateDays(new Date())).toFixed(2))
  }

  getDaysInMonth(year: number, month: number): number {
    // Berechnet die Anzahl der Tage im angegebenen Monat
    return new Date(year, month, 0).getDate();
  }

  getRemainingDays(d: Date) {
    switch (d.getMonth()) {
      case 0:
        return this.getDaysInMonth(d.getFullYear(), 0) + this.getDaysInMonth(d.getFullYear(), 1) + this.getDaysInMonth(d.getFullYear(), 2)- d.getDate();
      case 1:
        return this.getDaysInMonth(d.getFullYear(), 1) + this.getDaysInMonth(d.getFullYear(), 2) - d.getDate();
      case 2:
        return this.getDaysInMonth(d.getFullYear(), 2) - d.getDate();
      case 3:
        return this.getDaysInMonth(d.getFullYear(), 3) + this.getDaysInMonth(d.getFullYear(), 4) + this.getDaysInMonth(d.getFullYear(), 5)- d.getDate();
      case 4:
        return this.getDaysInMonth(d.getFullYear(), 4) + this.getDaysInMonth(d.getFullYear(), 5) - d.getDate();
      case 5:
        return this.getDaysInMonth(d.getFullYear(), 5) - d.getDate();
      case 6:
        return this.getDaysInMonth(d.getFullYear(), 6) + this.getDaysInMonth(d.getFullYear(), 7) + this.getDaysInMonth(d.getFullYear(), 8)- d.getDate();
      case 7:
        return this.getDaysInMonth(d.getFullYear(), 7) + this.getDaysInMonth(d.getFullYear(), 8) - d.getDate();
      case 8:
        return this.getDaysInMonth(d.getFullYear(), 8) - d.getDate();
      case 9:
        return this.getDaysInMonth(d.getFullYear(), 9) + this.getDaysInMonth(d.getFullYear(), 10) + this.getDaysInMonth(d.getFullYear(), 11)- d.getDate();
      case 10:
        return this.getDaysInMonth(d.getFullYear(), 10) + this.getDaysInMonth(d.getFullYear(), 11) - d.getDate();
      case 11:
        return this.getDaysInMonth(d.getFullYear(), 11) - d.getDate();
      default:
        return 0;
    }
  }
}
