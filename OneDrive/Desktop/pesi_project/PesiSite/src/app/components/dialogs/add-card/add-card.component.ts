import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService, User } from 'src/app/services/auth.service';
import { CardsService } from 'src/app/services/cards.service';
import { InstallationsService } from 'src/app/services/installations.service';
import { SnackbarsService } from 'src/app/services/snackbars.service';
import { UsersService } from 'src/app/services/users.service';
import { admin } from 'src/assets/global';
import { HttpErrorResponse } from '@angular/common/http';
import { toInteger, toNumber } from 'lodash';
import { Subject, catchError, takeUntil, throwError } from 'rxjs';
import { Card as iCard } from '../../../services/cards.service';
import { SubjectsService } from 'src/app/services/subjects.service';

interface Card {
  cardCode: string;
  vehicle: string;
  plate: string;
  tare: number;
  idSubject: number;
  idInstallation: number;
}

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.css']
})
export class AddCardComponent implements OnInit, OnDestroy {
  addForm = this.fb.group({
    cardCode: ['', {validators: Validators.required, min: 6, max: 30}],
    vehicle: ['', {validators: Validators.required, min: 4, max: 20}],
    plate: ['', {validators: Validators.required, min: 6, max: 20}],
    idSubject: ['', {validators: Validators.required}],
    idInstallation: ['']
  })

  subjects$ = this.subjectsSrv.subjects$;
  installations$ = this.installationsSrv.installations$;

  accessLevels!: number[];

  private destroyed$ = new Subject<void>();

  hide = true;

  constructor(
    private snackbarsSrv: SnackbarsService,
    private fb: FormBuilder,
    private cardsSrv: CardsService,
    public dialogRef: MatDialogRef<AddCardComponent>,
    private installationsSrv: InstallationsService,
    private subjectsSrv: SubjectsService,
    private authSrv: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: Card,
  ) {
  }

  ngOnInit(): void {
    this.isAdmin();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  add(){
    if(this.addForm.valid){
      let _idSubject = null;
      let _idInstallation = null;
      const { cardCode, vehicle, plate, idSubject, idInstallation } = this.addForm.value;
      if(idSubject) _idSubject = toInteger(idSubject);
      if(idInstallation) _idInstallation = toInteger(idInstallation);
      console.log(_idInstallation);
      this.cardsSrv.add(cardCode!, vehicle!, plate!, _idSubject!, _idInstallation!)
        .pipe(
          catchError(err => throwError(err))
        )
        .subscribe(
          (value: iCard) => {
            this.snackbarsSrv.openSnackBar("Carta aggiunta!", "green");
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

  private isAdmin() {
    this.authSrv.currentUser$
    .pipe(
      takeUntil(this.destroyed$)
    )
    .subscribe(value => {
      if(!value){
        this.authSrv.fetchUser().subscribe(value => {
          this.toggleRequired(value.accessLevel);
        })
      }else{
        this.toggleRequired(value.accessLevel);
      }
    })
  }

  private toggleRequired(accessLevel: number) {
    const myFieldControl = this.addForm.get('idInstallation');

    if (myFieldControl) {
      if (accessLevel >= admin) {
        myFieldControl.setValidators(Validators.required); // Aggiungi Validators.required
      } else {
        myFieldControl.clearValidators(); // Rimuovi Validators.required
      }

      myFieldControl.updateValueAndValidity();
    }
  }
}
