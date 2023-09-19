import { ResolveFn } from '@angular/router';
import { pick } from 'lodash';
import { SubjectFilter } from 'src/app/services/subjects.service';

export const subjectsFilterResolver: ResolveFn<SubjectFilter> = (route, state) => {
  return pick(route.queryParams, ['socialReason', 'telephoneNumber', 'CFPIVA'])
};
