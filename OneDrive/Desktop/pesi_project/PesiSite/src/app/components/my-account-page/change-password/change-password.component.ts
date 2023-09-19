import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject, catchError, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { SnackbarsService } from 'src/app/services/snackbars.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  passwordForm = this.fb.group({
    password: ['', {validators: Validators.required, min: 8, max: 20}]
  })

  newPasswordForm = this.fb.group({
    newPassword: ['', {validators: Validators.required, min: 8, max: 20}]
  })

  repeatPasswordForm = this.fb.group({
    repeatPassword: ['', {validators: Validators.required, min: 8, max: 20}]
  })

  hide = true;
  
  private destroyed$ = new Subject<void>();

  constructor(private snackBar: SnackbarsService,
              private authSrv: AuthService,
              protected fb: FormBuilder){}
  
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  hideInput(){
    this.hide = true;
  }

  checkSame(){
    this.hide = true;
    if(this.newPasswordForm.value.newPassword === this.repeatPasswordForm.value.repeatPassword){
      return true;
    }
    return false;
  }

  changePassword(){
    this.passwordForm
    if (this.passwordForm.valid  && this.newPasswordForm.valid && this.repeatPasswordForm.valid) {
      const password = this.passwordForm.value.password; 
      const newPassword = this.newPasswordForm.value.newPassword; 
      const repeatPassword = this.repeatPasswordForm.value.repeatPassword;
      this.authSrv.changePassword(password!, newPassword!, repeatPassword!)
        .pipe(
          catchError(err => {
            console.log(err)
            if(err.status === 429) this.snackBar.openSnackBar(err.error, 'red')
            else this.snackBar.openSnackBar(err.error.message, 'red');
            return throwError(() => err);   
          })
        )
        .subscribe(() => {
          this.snackBar.openSnackBar("Password cambiata", 'green')
          this.passwordForm.value.password = ''
          this.newPasswordForm.value.newPassword = ''
          this.repeatPasswordForm.value.repeatPassword = ''
        });
    }else{
      console.log("Error")
    }
  }
}
