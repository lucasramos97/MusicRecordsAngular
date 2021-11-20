import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration',
})
export class DurationPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): string {
    if (!value) {
      return '';
    }

    return `${value.slice(3)} min`;
  }
}
