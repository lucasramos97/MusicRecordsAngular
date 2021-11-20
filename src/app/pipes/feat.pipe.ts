import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'feat',
})
export class FeatPipe implements PipeTransform {
  transform(value: boolean, ...args: unknown[]): string {
    return value ? 'Yes' : 'No';
  }
}
