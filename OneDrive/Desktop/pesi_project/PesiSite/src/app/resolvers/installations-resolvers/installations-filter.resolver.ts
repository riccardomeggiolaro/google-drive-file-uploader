import { ResolveFn } from '@angular/router';
import { pick } from 'lodash';
import { InstallationFilter } from 'src/app/services/installations.service';

export const installationsFilterResolver: ResolveFn<InstallationFilter> = (route, state) => {
  return pick(route.queryParams, ['installationCode', 'description'])
};