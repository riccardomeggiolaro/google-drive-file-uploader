import { ResolveFn } from '@angular/router';
import { InstallationsService } from 'src/app/services/installations.service';
import { inject } from '@angular/core';
import { pick } from 'lodash';

export const installationsResolver: ResolveFn<void> = (route, state) => {
  const installationsSrv = inject(InstallationsService);
  const filters = pick(route.queryParams, ['installationCode', 'description']);
  installationsSrv.list(filters);
};