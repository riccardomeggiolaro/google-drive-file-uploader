import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'string'
})
export class StringPipe implements PipeTransform {

  transform(value: string | Date | number | null | undefined): string | undefined {
    if(!value) return;
    return `"${value}"`;
  }

}
