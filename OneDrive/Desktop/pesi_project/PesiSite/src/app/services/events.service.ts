import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject, catchError, combineLatest, of, switchMap, tap, throwError } from 'rxjs';
import { isNil, omitBy } from 'lodash';
import { HttpClient } from '@angular/common/http';
import { Card } from './cards.service';

export interface EventFilter {
  dtMin?: Date | null;
  dtMax?: Date | null;
  cardCode?: string | null;
  plate?: string | null;
  socialReason?: string | null;
  idInstallation?: number | null;
}

export interface Event {
  dt_create: Date;
  progressive: number;
  note1: string;
  note2: number;
  weight1: number;
  pid1: string;
  weight2: number;
  pid2: string;
  netWeight: number;
  material: string;
  card: Card;
  idInstallation: number;
}

@Injectable({
  providedIn: 'root'
})
export class EventsService {  
  private _filters$ = new BehaviorSubject<EventFilter | null>(null);
  filters$ = this._filters$.asObservable();
  private _requestUpdate$ = new ReplaySubject<void>();
  private _actions$ = new BehaviorSubject<"add" | "delete" | "filter">("filter");
  actions$ = this._actions$.asObservable();

  events$ = combineLatest([
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
        return this.http.get<Event[]>('/api/event/list', {params: q})
          .pipe(
            catchError(err => of([]))
          )
      }
    )
  )

  constructor(private http: HttpClient) {
    this._requestUpdate$.next();
  }

  list(filters: EventFilter) {
    this._filters$.next(filters);
    this._actions$.next("filter");
  }

  delete(id: number) {
    return this.http.delete<{message: string}>(`/api/event/${id}`)
      .pipe(
        tap(res => this._requestUpdate$.next()),
        tap(res => this._actions$.next("delete"))
      )
  }

  add(dt_create: Date, progressive: number, note1: string, note2: string, weight1: number, pid1: string, weight2: number, pid2: string, netWeight: number, material: string, idCard: number, idInstallation: number){
    return this.http.post<Event>('/api/event/add-event', {dt_create, progressive, note1, note2, weight1, pid1, weight2, pid2, netWeight, material, idCard, idInstallation})
      .pipe(
        tap(res => this._requestUpdate$.next()),
        tap(res => this._actions$.next("add"))
      )
  }
}
