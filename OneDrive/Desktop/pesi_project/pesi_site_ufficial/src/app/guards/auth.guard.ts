import { inject } from "@angular/core";
import { catchError, finalize, first, map, mergeMap, skip, subscribeOn, switchMap } from "rxjs/operators";
import { JwtService } from "../services/jwt.service";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateFn, Router } from '@angular/router';
import { AuthService, User } from '../services/auth.service';
import { Observable, Subscription, of } from 'rxjs';
import { response } from "express";

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);  
  const authSrv = inject(AuthService);
  const jwtSrv = inject(JwtService);

  const isLoggedIn = authSrv.isLoggedIn();

  if (!isLoggedIn) {
    router.navigate(['/login']);
    return false;
  }
  
  return authSrv.checkUserExistence().pipe(
    map((userExists: User) => {
      if (userExists) {
        authSrv.fetchUser(userExists);
        return true; // L'utente esiste, permetti l'accesso
      } else {
        jwtSrv.removeToken();
        router.navigate(['/login']); // Reindirizza l'utente alla pagina di login
        return false;
      }
    }),
    catchError(() => {
      jwtSrv.removeToken();
      router.navigate(['/login']); // Gestione degli errori
      return of(false);
    })
  );
}