import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'musicFeat'
})
export class MusicFeatPipe implements PipeTransform {

  transform(feat: boolean): string {
    return feat ? 'Yes' : 'No';
  }

}
