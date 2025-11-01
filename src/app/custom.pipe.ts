import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'custom'
})
export class CustomPipe extends DatePipe implements PipeTransform {
  
  override transform(value: any, args?: any): any {
    return super.transform(value, "EEEE d MMMM y h:mm a");
  }

}
