import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, Subject, catchError, map, of } from 'rxjs';
import { User } from '../services/auth.service';
import { NavigationService } from '../services/navigation.service';
import { HttpErrorResponse } from '@angular/common/http';
import { admin } from 'src/assets/global';

export const adminGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
  const router = inject(Router);  
  const authSrv = inject(AuthService);
  const navigation = inject(NavigationService);

  const isLoggedIn = authSrv.isLoggedIn();

  if (!isLoggedIn) {
    router.navigate(['/login']);
    return false;
  }
  
  return authSrv.fetchUser().pipe(
    map((value: User) => {
      if(value && value.accessLevel >= admin){
        return true;
      }else{
        navigation.back();
        return false;
      }
    }),
    catchError(() => {
      return of(false);
    })
  );
}