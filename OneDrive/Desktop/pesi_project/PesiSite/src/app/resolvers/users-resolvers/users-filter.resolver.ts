import { ResolveFn } from '@angular/router';
import { UserFilter } from '../../services/users.service';
import { pick } from 'lodash';

export const usersFilterResolver: ResolveFn<UserFilter> = (route, state) => {
  console.log("Pick users filters")
  return pick(route.queryParams, ['username', 'idInstallation'])
};