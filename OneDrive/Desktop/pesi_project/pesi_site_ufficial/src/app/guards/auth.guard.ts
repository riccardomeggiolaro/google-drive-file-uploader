import { inject } from "@angular/core";
import { AuthService, User } from "../services/auth.service";
import { CanActivateFn, Router } from '@angular/router';
import { first, map, skip } from "rxjs/operators";
import { JwtService } from "../services/jwt.service";

export const authGuard: CanActivateFn = async (route, state) => {

  const router = inject(Router);
  const authSrv = inject(AuthService);
  const jwtSrv = inject(JwtService);
  const isAuthenticated = authSrv.isLoggedIn();

  if(!authSrv.isLogin){
    const value = await authSrv.currentUser$.pipe(skip(1), first()).toPromise();
    console.log(value);
    if(!value){
      if(isAuthenticated) jwtSrv.removeToken();
      router.navigateByUrl('/login');
      return false;      
    }
  }

  if (isAuthenticated) {
    return true;
  } else {
    router.navigateByUrl('/login');
    return false;
  }
}