import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from "rxjs"
import { JwtService } from "./jwt.service";
import { Location } from "@angular/common";
import { Installation } from "./installations.service";

export interface User {
  id: number;
  username: string;
  hashedPassword: string;
  able: boolean;
  accessLevel: number;
  lastAccess: Date;
  installation?: Installation;
}

@Injectable({providedIn: 'root'})
export class AuthService {
  private _currentUser$ = new BehaviorSubject<User | null>(null);

  currentUser$ = this._currentUser$.asObservable();

  constructor(private jwtSrv: JwtService,
              private http: HttpClient,
              private router: Router,
              public location: Location) {
  }

  isLoggedIn() {
    return this.jwtSrv.hasToken();
  }

  login(username: string, password: string) {
    return this.http.post<{user: User, token: string}>('/api/auth/login', {username, password})
      .pipe(
        tap(res => this.jwtSrv.setToken(res.token)),
        tap(res => this._currentUser$.next(res.user)),
        map(res => res.user)
      );
  }

  changePassword(oldPassword: string, newPassword: string, repeatPassword: string){
    return this.http.patch<{message: string}>('/api/user/update/change-password', {oldPassword, newPassword, repeatPassword})
      .pipe(
        map(res => res.message)
      )
  }

  logout() {
    this.lastAccess("offline");
    this.jwtSrv.removeToken();
    this._currentUser$.next(null);
    this.router.navigate(['/login']);
  }

  private error(err: HttpErrorResponse){
    this.logout();
    return throwError(err);
  }

  fetchUser(): Observable<User>  {
    return this.http.get<User>('/api/user/me')
      .pipe(
        tap(res => this._currentUser$.next(res)),
        tap(res => this.lastAccess("online")),
        catchError(err => this.error(err))
      )
  }

  getUser(){
    return this._currentUser$.value;
  }

  lastAccess(status: "offline" | "online"){
    let obj: any = {};
    if(status === "offline") obj["date"] = Date.now();
    this.http.patch('/api/user/update/last-access', obj).subscribe();
  }
}