import { ResolveFn } from '@angular/router';
import { User } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { catchError, of } from 'rxjs';
import { pick, toPlainObject, toString } from 'lodash';
import { inject } from '@angular/core';

export const usersResolver: ResolveFn<void> = (route, state) => {
  console.log("Change filters")
  const usersSrv = inject(UsersService);
  const filters = pick(route.queryParams, ['username', 'idInstallation']);
  usersSrv.list(filters);
};