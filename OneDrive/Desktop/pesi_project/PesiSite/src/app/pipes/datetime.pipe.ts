import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'datetime'
})
export class DatetimePipe implements PipeTransform {
  transform(value: Date): string | null {
    if(value) return new Date(value).toLocaleString();
    return null;
  }
}
