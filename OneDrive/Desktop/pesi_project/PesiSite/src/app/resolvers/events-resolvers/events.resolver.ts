import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { pick } from 'lodash';
import { EventsService } from 'src/app/services/events.service';

export const eventsResolver: ResolveFn<void> = (route, state) => {
  const cardSrv = inject(EventsService);
  const filters = pick(route.queryParams, ['dtMin', 'dtMax', 'cardCode', 'plate', 'socialReason', 'idInstallation']);
  cardSrv.list(filters);
};
