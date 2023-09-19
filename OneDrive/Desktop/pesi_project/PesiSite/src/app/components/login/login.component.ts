import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, catchError, takeUntil, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm = this.fb.group({
    username: ['', {validators: Validators.required}],
    password: ['', {validators: Validators.required}]
  })

  hide = true;

  togglePasswordVisibility(event: Event){
    event.stopPropagation();
    this.hide = !this.hide;
  }

  private destroyed$ = new Subject<void>();

  constructor(private snackBar: MatSnackBar,
              protected fb: FormBuilder,
              private route: ActivatedRoute,
              private authSrv: AuthService,
              private router: Router) { }

  openSnackBar(message: string) {
    this.snackBar.open(message, "Close", {
      duration: 3000,
      panelClass: ['red'],
    });
  }
              
  ngOnInit(): void {
    this.loginForm.valueChanges
      .pipe(
        takeUntil(this.destroyed$)
      )
      .subscribe(() => {
        this.snackBar.dismiss();
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  login() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authSrv.login(username!, password!)
        .pipe(
          catchError(err => {
            if(err.status === 429) this.openSnackBar(err.error)
            else this.openSnackBar(err.error.code);
            return throwError(() => err);   
          })
        )
        .subscribe(() => {
          this.router.navigate(['/events'])
        });
    }
  }
}
