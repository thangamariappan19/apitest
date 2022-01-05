import { Pipe, PipeTransform } from '@angular/core';
import { MBrandMaster } from 'src/app/models/m-brand-master';

@Pipe({
  name: 'searchfilter'
})
export class SearchfilterPipe implements PipeTransform {

  transform(brands : Array<MBrandMaster>,SearchValue: string):  Array<MBrandMaster> {
    if(!brands || !SearchValue)
    {
      return brands;
    }
    return brands.filter(brand =>
      brand.brandName.toLocaleLowerCase().includes(SearchValue.toLocaleLowerCase()))
  }

}
