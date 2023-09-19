import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { toNumber } from 'lodash';
import { catchError, throwError } from 'rxjs';
import { SnackbarsService } from 'src/app/services/snackbars.service';
import { Subject, SubjectsService } from 'src/app/services/subjects.service';

@Component({
  selector: 'app-add-subject',
  templateUrl: './add-subject.component.html',
  styleUrls: ['./add-subject.component.css']
})
export class AddSubjectComponent {
  addForm = this.fb.group({
    socialReason: ['', {validators: Validators.required, min: 8, max: 50}],
    telephoneNumber: ['', {validators: Validators.required, min: 6, max: 11}],
    CFPIVA: ['', {validators: Validators.required, min: 15, max: 30}],
  })

  constructor(
    private snackbarSrv: SnackbarsService,
    private fb: FormBuilder,
    private subjectsSrv: SubjectsService,
    public dialogRef: MatDialogRef<AddSubjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Subject,
  ) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  add(){
    if(this.addForm.valid){
      const { socialReason, telephoneNumber, CFPIVA } = this.addForm.value;
      this.subjectsSrv.add(socialReason!, toNumber(telephoneNumber!), CFPIVA!)
        .pipe(
          catchError(err => throwError(err))
        )
        .subscribe(
          (value: Subject) => {
            this.snackbarSrv.openSnackBar("Soggetto aggiunto!", "green");
            this.dialogRef.close();
          },
          (error: HttpErrorResponse) => {
            let message = "";
            if(error.status === 400) message = error.error.message;
            else message = "Errore generico, per favore riprova più tardi";
            console.log(error);
            this.snackbarSrv.openSnackBar(message, "red");
          }
        )
    }
  }
}
