import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { isNil, omitBy } from 'lodash';
import { BehaviorSubject, ReplaySubject, catchError, combineLatest, of, switchMap, tap, throwError } from 'rxjs';

export interface InstallationFilter {
  installationCode?: string | null;
  description?: string | null;
}

export interface Installation {
  id: number;
  installationCode: string;
  description: string;
  imei: string;
}

@Injectable({
  providedIn: 'root'
})
export class InstallationsService {
  private _filters$ = new BehaviorSubject<InstallationFilter | null>(null);
  filters$ = this._filters$.asObservable();
  private _requestUpdate$ = new ReplaySubject<void>();
  private _actions$ = new BehaviorSubject<"add" | "delete" | "filter">("filter");
  actions$ = this._actions$.asObservable();

  installations$ = combineLatest([
    this._requestUpdate$,
    this.filters$
  ]).pipe(
    catchError(err => {
      console.log(err);
      throwError(err);
      return []
    }),
    switchMap(
      ([_, filters]) => {
        const q = omitBy(filters, isNil);
        return this.http.get<Installation[]>('/api/installation/list', {params: q})
          .pipe(
            catchError(err => of([]))
          )
      }
    )
  )

  constructor(private http: HttpClient) {
    this._requestUpdate$.next();
  }

  list(filters: InstallationFilter) {
    this._filters$.next(filters);
    this._actions$.next("filter");
  }

  assigned() {
    return this.http.get<Installation>('/api/installation/assigned')
      .pipe(
        tap(res => this._requestUpdate$.next())
      )
  }

  delete(id: number) {
    return this.http.delete<{message: string}>(`/api/installation/${id}`)
      .pipe(
        tap(res => this._requestUpdate$.next()),
        tap(res => this._actions$.next("delete"))
      )
  }

  add(installationCode: string, description: string, imei: string){
    return this.http.post<Installation>('/api/installation/add-installation', {installationCode, description, imei})
      .pipe(
        tap(res => {
          this._filters$.next(this._filters$.value);
          this._requestUpdate$.next();
        }),
        tap(res => this._actions$.next("add"))
      )
  }
}
