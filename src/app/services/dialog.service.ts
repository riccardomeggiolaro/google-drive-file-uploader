import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogContentComponent, DialogData } from '../components/dialog-content/dialog-content.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(public dialog: MatDialog) {}

  openDialog(data: DialogData) {
    this.dialog.open(DialogContentComponent, {
      data: data,
    });
  }
}
