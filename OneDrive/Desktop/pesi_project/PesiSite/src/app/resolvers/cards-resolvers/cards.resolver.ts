import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { pick } from 'lodash';
import { CardsService } from 'src/app/services/cards.service';

export const cardsResolver: ResolveFn<void> = (route, state) => {
  const cardSrv = inject(CardsService);
  const filters = pick(route.queryParams, ['cardCode', 'plate', 'socialReason', 'idInstallation']);
  cardSrv.list(filters);
};
