import { ResolveFn } from '@angular/router';
import { pick } from 'lodash';
import { CardFilter } from 'src/app/services/cards.service';

export const cardsFilterResolver: ResolveFn<CardFilter> = (route, state) => {
  return pick(route.queryParams, ['cardCode', 'plate', 'socialReason', 'idInstallation'])
};
