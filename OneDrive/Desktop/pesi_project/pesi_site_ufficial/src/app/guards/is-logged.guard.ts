import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { JwtService } from '../services/jwt.service';

export const isLoggedGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const authSrv = inject(AuthService);

  const isAuthenticated = authSrv.isLoggedIn();

  if(isAuthenticated){
    router.navigate(['/dashboard']);
    return false;
  }else{
    return true;
  }
};
