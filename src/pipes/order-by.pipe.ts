import { Pipe } from '@angular/core';
import * as _ from 'lodash';

@Pipe({ name: 'orderby' })
export class OrderByPipe {
  transform(array, args) {
    return _.sortBy(array, args);
  }
}
