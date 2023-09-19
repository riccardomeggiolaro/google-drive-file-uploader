import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { toInteger, toNumber } from 'lodash';
import { BehaviorSubject, catchError, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { admin, superAdmin } from 'src/assets/global';
import { User as iUser } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { SnackbarsService } from 'src/app/services/snackbars.service';
import { InstallationsService } from 'src/app/services/installations.service';

export interface User {
  username: string;
}

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  addForm = this.fb.group({
    username: ['', {validators: Validators.required, min: 8, max: 50}],
    password: ['', {validators: Validators.required, min: 8, max: 20}],
    accessLevel: ['', {validators: Validators.required}],
    idInstallation: ['']
  })

  accessLevels!: number[];
  installations$ = this.installationsSrv.installations$;
  user!: iUser | null;

  hide = true;

  constructor(
    private snackbarsSrv: SnackbarsService,
    private fb: FormBuilder,
    private usersSrv: UsersService,
    public dialogRef: MatDialogRef<AddUserComponent>,
    private installationsSrv: InstallationsService,
    private authSrv: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: User,
  ) {
  }

  ngOnInit(): void {
    this.user = this.authSrv.getUser();
    this.accessLevels = this.array(this.user?.accessLevel!);
    if(this.accessLevels.length === 1){
      this.addForm.setValue({username: '', password: '', accessLevel: '1', idInstallation: ''});
    }
  }

  array(value: number): number[]{
    if(value < 1) return [];
    return Array.from({ length: value - 1 }, (_, i) => i + 1);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  add(){
    if(this.addForm.valid){
      let _idInstallation = null;
      const { username, password, accessLevel, idInstallation } = this.addForm.value;
      if(idInstallation) _idInstallation = toInteger(idInstallation);
      console.log(_idInstallation);
      this.usersSrv.add(username!, password!, toInteger(accessLevel!), _idInstallation)
        .pipe(
          catchError(err => throwError(err))
        )
        .subscribe(
          (value: iUser) => {
            this.snackbarsSrv.openSnackBar("Utente aggiunto!", "green");
            this.dialogRef.close();
          },
          (error: HttpErrorResponse) => {
            let message = "";
            if(error.status === 400) message = error.error.message;
            else message = "Errore generico, per favore riprova più tardi";
            console.log(error);
            this.snackbarsSrv.openSnackBar(message, "red");
          }
        )
    }
  }

  isAdmin(accessLevel: string | null | undefined): boolean {
    this.toggleRequired(toNumber(accessLevel));
    if(accessLevel){
      const value = toNumber(accessLevel) >= admin;
      return value;
    }
    return true;
  }

  toggleRequired(accessLevel: number) {
    const myFieldControl = this.addForm.get('idInstallation');

    if (myFieldControl) {
      if (accessLevel >= admin) {
        myFieldControl.clearValidators(); // Rimuovi Validators.required
      } else {
        myFieldControl.setValidators(Validators.required); // Aggiungi Validators.required
      }

      myFieldControl.updateValueAndValidity();
    }
  }
}