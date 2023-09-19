import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Installation, InstallationsService } from 'src/app/services/installations.service';
import { Inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { SnackbarsService } from 'src/app/services/snackbars.service';

@Component({
  selector: 'app-add-installation',
  templateUrl: './add-installation.component.html',
  styleUrls: ['./add-installation.component.css']
})
export class AddInstallationComponent {
  addForm = this.fb.group({
    installationCode: ['', {validators: Validators.required, min: 8, max: 50}],
    description: ['', {validators: Validators.required, min: 8, max: 50}],
    imei: ['', {validators: Validators.required, length: 15}],
  })

  constructor(
    private snackbarSrv: SnackbarsService,
    private fb: FormBuilder,
    private installationsSrv: InstallationsService,
    public dialogRef: MatDialogRef<AddInstallationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Installation,
  ) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  add(){
    if(this.addForm.valid){
      const { installationCode, description, imei } = this.addForm.value;
      this.installationsSrv.add(installationCode!, description!, imei!)
        .pipe(
          catchError(err => throwError(err))
        )
        .subscribe(
          (value: Installation) => {
            this.snackbarSrv.openSnackBar("Installazione aggiunta!", "green");
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
