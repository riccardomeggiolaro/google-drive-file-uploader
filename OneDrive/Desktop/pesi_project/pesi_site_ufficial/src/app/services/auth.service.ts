import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, first, map, skip, tap } from "rxjs"
import { JwtService } from "./jwt.service";
import { Location } from "@angular/common";

export interface Installation {
  id: number;
  installationCode: string;
  description: string;
  imei: string;
}

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
  private _admin$ = new BehaviorSubject<boolean | null>(null);

  currentUser$ = this._currentUser$.asObservable();
  admin$ = this._admin$.asObservable();
  isLogin = false;

  constructor(private jwtSrv: JwtService,
              private http: HttpClient,
              private router: Router,
              public location: Location) {
  }

  isLoggedIn() {
    return this.jwtSrv.hasToken();
  }

  isAdmin(){
    return this._currentUser$.value?.accessLevel! > 3 ? true : false;
  }

  login(username: string, password: string) {
    return this.http.post<{user: User, token: string}>('/api/auth/login', {username, password})
      .pipe(
        tap(res => this.jwtSrv.setToken(res.token)),
        tap(res => this.isLogin = true),
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
    this.jwtSrv.removeToken();
    this._currentUser$.next(null);
    this.router.navigate(['/']);
  }

  fetchUser(value: User | null) {
    this._currentUser$.next(value);
  }

  checkUserExistence(): Observable<User> {
    return this.http.get<User>('/api/user/me');
  }

  getUser(){
    return this._currentUser$.value;
  }
}