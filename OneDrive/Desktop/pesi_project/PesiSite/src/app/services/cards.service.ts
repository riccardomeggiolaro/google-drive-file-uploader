import { Injectable } from '@angular/core';
import { isNil, omitBy } from 'lodash';
import { BehaviorSubject, ReplaySubject, catchError, combineLatest, of, switchMap, tap, throwError } from 'rxjs';
import { Subject } from './subjects.service';
import { Installation } from './installations.service';
import { HttpClient } from '@angular/common/http';
import { UserFilter } from './users.service';

export interface CardFilter {
  cardCode?: string | null;
  plate?: string | null;
  socialReason?: string | null;
  idInstallation?: number | null;
}

export interface Card {
  cardCode: string;
  vehicle: string;
  plate: string;
  tare: number;
  subject?: Subject;
  installation?: Installation;
}

@Injectable({
  providedIn: 'root'
})
export class CardsService {
  private _filters$ = new BehaviorSubject<CardFilter | null>(null);
  filters$ = this._filters$.asObservable();
  private _requestUpdate$ = new ReplaySubject<void>();
  private _actions$ = new BehaviorSubject<"add" | "delete" | "filter">("filter");
  actions$ = this._actions$.asObservable();

  cards$ = combineLatest([
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
        return this.http.get<Card[]>('/api/card/list', {params: q})
          .pipe(
            catchError(err => of([]))
          )
      }
    )
  )

  constructor(private http: HttpClient) {
    this._requestUpdate$.next();
  }

  list(filters: CardFilter) {
    this._filters$.next(filters);
    this._actions$.next("filter");
  }

  delete(id: number) {
    return this.http.delete<{message: string}>(`/api/card/${id}`)
      .pipe(
        tap(res => this._requestUpdate$.next()),
        tap(res => this._actions$.next("delete"))
      )
  }

  add(cardCode: string, vehicle: string, plate: string, idSubject: number, idInstallation: number){
    return this.http.post<Card>('/api/card/add-card', {cardCode, vehicle, plate, idSubject, idInstallation})
      .pipe(
        tap(res => this._requestUpdate$.next()),
        tap(res => this._actions$.next("add"))
      )
  }
}
