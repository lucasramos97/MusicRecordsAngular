import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'launchDate'
})
export class LaunchDatePipe implements PipeTransform {

  transform(launchDate: string): string {
    let day = launchDate.substring(0, 2);
    let month = launchDate.substring(2, 4);
    let year = launchDate.substring(4);
    return `${day} ${this.getMonthName(month)} ${year}`;
  }

  private getMonthName(month: string): string {
    if (month === '01') {
      return 'January';
    } else if (month === '02') {
      return 'February';
    } else if (month === '03') {
      return 'March';
    } else if (month === '04') {
      return 'April';
    } else if (month === '05') {
      return 'May';
    } else if (month === '06') {
      return 'June';
    } else if (month === '07') {
      return 'July';
    } else if (month === '08') {
      return 'August';
    } else if (month === '09') {
      return 'September';
    } else if (month === '10') {
      return 'October';
    } else if (month === '11') {
      return 'November';
    } else if (month === '12') {
      return 'December';
    } else {
      return '';
    }
  }

}
