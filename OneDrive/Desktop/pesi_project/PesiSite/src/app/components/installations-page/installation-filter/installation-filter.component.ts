import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject, debounceTime, filter, map, takeUntil } from 'rxjs';
import { InstallationsService } from 'src/app/services/installations.service';
import { AddInstallationComponent } from '../../dialogs/add-installation/add-installation.component';
import { Router } from '@angular/router';
import { omitBy } from 'lodash';

@Component({
  selector: 'app-installation-filter',
  templateUrl: './installation-filter.component.html',
  styleUrls: ['./installation-filter.component.css']
})
export class InstallationFilterComponent implements OnInit {
  filtersForm = this.fb.group({
    installationCode: this.fb.control<string|null>(''),
    description: this.fb.control<string | null>('')
  });

  private destroyed$ = new Subject<void>()

  constructor(private fb: FormBuilder,
              public dialog: MatDialog,
              private router: Router,
              private installationsSrv: InstallationsService) {
              }

  ngOnInit(): void {
    this.installationsSrv.filters$.subscribe(value => {
      this.filtersForm.patchValue(value || {}, {emitEvent: false});
      this.filtersForm.markAsPristine();
    })
    this.filtersForm.valueChanges
      .pipe(
        takeUntil(this.destroyed$),
        filter(_ => this.filtersForm.valid),
        map(value => omitBy(value, val => val === '')),
        debounceTime(200)
      )
      .subscribe(value => {
        this.router.navigate([], {queryParams: value});
      });
  }

  ngOnDestroy(): void {
      this.destroyed$.next();
      this.destroyed$.complete();
  }

  deleteFilters(){
    this.filtersForm.patchValue({installationCode: '', description: ''})
  }

  openDialog(): void {
    this.dialog.open(AddInstallationComponent, {
      data: {username: null, description: null}
    });
  }            
}