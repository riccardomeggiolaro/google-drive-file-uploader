import { Pipe, PipeTransform } from '@angular/core';
import { admin, superAdmin } from 'src/assets/global';

@Pipe({
  name: 'typeUser'
})
export class TypeUserPipe implements PipeTransform {

  transform(value: number): string {
    if(value === admin) return `${value} | amministratore`;
    else if(value === superAdmin) return `${value} | super-amministratore`
    else return `${value} | utente`
  }

}
