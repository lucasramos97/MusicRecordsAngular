import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'musicTime'
})
export class MusicTimePipe implements PipeTransform {

  transform(time: string): string {
    if (time) {
      let minuteAndSecond = time.substr(3);
      if (minuteAndSecond[0] !== '0') {
        return minuteAndSecond;
      }
      return minuteAndSecond.substr(1);
    }
    return ''
  }

}
