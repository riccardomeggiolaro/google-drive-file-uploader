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
  const authSrv = inject(AuthService);

  const isLoggedIn = authSrv.isLoggedIn();

  if(isLoggedIn){
    return true;
  }else{
    return false;
  }
}