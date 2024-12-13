import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roman'
})
export class RomanPipe implements PipeTransform {

  transform(value: string | number, ...args: string[]): string {
    switch(+value){
      case 1:
        return 'I'
      case 2:
        return 'II'
      case 3:
        return 'III'
      case 4:
        return 'IV'
      case 5:
        return 'V'
      case 6:
        return 'VI'
      case 7:
        return 'VII'
      case 8:
        return '8I'
      case 9:
        return '9II'
      default:
        return ''
    }
  }

}
