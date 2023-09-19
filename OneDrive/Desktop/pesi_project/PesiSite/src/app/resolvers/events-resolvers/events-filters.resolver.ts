import { ResolveFn } from '@angular/router';
import { pick } from 'lodash';
import { EventFilter } from 'src/app/services/events.service';

export const eventsFiltersResolver: ResolveFn<EventFilter> = (route, state) => {
  return pick(route.queryParams, ['dtMin', 'dtMax', 'cardCode', 'plate', 'socialReason', 'idInstallation'])
};