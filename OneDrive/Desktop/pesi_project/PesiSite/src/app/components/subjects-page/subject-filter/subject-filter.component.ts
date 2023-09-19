import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { omitBy } from 'lodash';
import { Subject, debounceTime, filter, map, takeUntil } from 'rxjs';
import { SubjectFilter, SubjectsService } from 'src/app/services/subjects.service';
import { AddSubjectComponent } from '../../dialogs/add-subject/add-subject.component';

@Component({
  selector: 'app-subject-filter',
  templateUrl: './subject-filter.component.html',
  styleUrls: ['./subject-filter.component.css']
})
export class SubjectFilterComponent {
  filtersForm = this.fb.group({
    socialReason: this.fb.control<string|null>(''),
    telephoneNumber: this.fb.control<number|null>(null),
    CFPIVA: this.fb.control<string|null>('')
  });

  private destroyed$ = new Subject<void>()

  constructor(private fb: FormBuilder,
              public dialog: MatDialog,
              private subjectsSrv: SubjectsService,
              private router: Router) {}

  ngOnInit(): void {
    this.subjectsSrv.filters$.subscribe(value => {
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
      const v = value as SubjectFilter;
      this.router.navigate([], {queryParams: v});
    });
  }
  
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  deleteFilters(){
    this.filtersForm.patchValue({socialReason: '', telephoneNumber: null, CFPIVA: ''})
  }

  openDialog(): void {
    this.dialog.open(AddSubjectComponent, {
      data: {username: null}
    });
  }
}
