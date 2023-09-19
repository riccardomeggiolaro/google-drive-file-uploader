import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, Subject, catchError, combineLatest, map, of, switchMap, tap, throwError } from 'rxjs';
import { User } from './auth.service';
import { isNil, omitBy } from 'lodash';

export interface UserFilter {
  username?: string | null;
  idInstallation?: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private _filters$ = new BehaviorSubject<UserFilter | null>(null);
  filters$ = this._filters$.asObservable();
  private _requestUpdate$ = new ReplaySubject<void>();
  private _actions$ = new BehaviorSubject<"add" | "delete" | "filter" | "change">("filter");
  actions$ = this._actions$.asObservable();

  users$ = combineLatest([
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
        console.log("Ricerca")
        const q = omitBy(filters, isNil);
        return this.http.get<User[]>('/api/user/list', {params: q})
          .pipe(
            catchError(err => of([]))
          )
      }
    )
  )

  constructor(private http: HttpClient) {
    this._requestUpdate$.next();
  }

  list(filters: UserFilter) {
    this._filters$.next(filters);
    this._actions$.next("filter");
  }

  delete(username: string) {
    return this.http.delete<{message: string}>(`/api/user/${username}`)
      .pipe(
        tap(res => this._requestUpdate$.next()),
        tap(res => this._actions$.next("delete"))
      )
  }

  disable(username: string, able: boolean){
    return this.http.patch<{message: string}>(`/api/user/${username}`, {able})
      .pipe(
        tap(res => this._requestUpdate$.next()),
        tap(res => this._actions$.next("change"))
      )
  }

  add(username: string, password: string, accessLevel: number, idInstallation: number | null){
    return this.http.post<User>('/api/auth/signin', {username, password, accessLevel, idInstallation})
      .pipe(
        tap(res => this._requestUpdate$.next()),
        tap(res => this._actions$.next("add"))
      )
  }
}