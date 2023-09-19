import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { pick } from 'lodash';
import { SubjectsService } from 'src/app/services/subjects.service';

export const subjectsResolver: ResolveFn<void> = (route, state) => {
  const subjectsSrv = inject(SubjectsService);
  const filters = pick(route.queryParams, ['socialReason', 'telephoneNumber', 'CFPIVA']);
  subjectsSrv.list(filters);
};
