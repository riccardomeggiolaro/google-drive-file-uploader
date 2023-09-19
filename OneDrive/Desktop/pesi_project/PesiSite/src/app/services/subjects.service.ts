import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { isNil, omitBy } from 'lodash';
import { BehaviorSubject, ReplaySubject, catchError, combineLatest, of, switchMap, tap, throwError } from 'rxjs';

export interface Subject {
  id: number;
  socialReason: string;
  telephoneNumber: number;
  CFPIVA: string;
}

export interface SubjectFilter {
  socialReason?: string | null;
  telephoneNumber?: number | null;
  CFPIVA?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class SubjectsService {
  private _filters$ = new BehaviorSubject<SubjectFilter | null>(null);
  filters$ = this._filters$.asObservable();
  private _requestUpdate$ = new ReplaySubject<void>();
  private _actions$ = new BehaviorSubject<"add" | "delete" | "filter" | "change">("filter");
  actions$ = this._actions$.asObservable();

  subjects$ = combineLatest([
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
        return this.http.get<Subject[]>('/api/subject/list', {params: q})
          .pipe(
            catchError(err => of([]))
          )
      }
    )
  )

  constructor(private http: HttpClient) { 
    this._requestUpdate$.next();
  }

  list(filters: SubjectFilter) {
    this._filters$.next(filters);
    this._actions$.next("filter");
  }

  delete(id: number) {
    return this.http.delete<{message: string}>(`/api/subject/${id}`)
      .pipe(
        tap(res => this._requestUpdate$.next()),
        tap(res => this._actions$.next("delete"))
      )
  }

  add(socialReason: string, telephoneNumber: number, CFPIVA: string){
    return this.http.post<Subject>('/api/subject/add-subject', {socialReason, telephoneNumber, CFPIVA})
      .pipe(
        tap(res => this._requestUpdate$.next()),
        tap(res => this._actions$.next("add"))
      )
  }
}
