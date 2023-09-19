import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { omitBy, toNumber } from 'lodash';
import { Subject, debounceTime, filter, map, takeUntil } from 'rxjs';
import { EventFilter, EventsService } from 'src/app/services/events.service';
import { InstallationsService } from 'src/app/services/installations.service';

@Component({
  selector: 'app-event-filter',
  templateUrl: './event-filter.component.html',
  styleUrls: ['./event-filter.component.css']
})
export class EventFilterComponent {
  filtersForm = this.fb.group({
    dtMin: this.fb.control<Date|null>(null),
    dtMax: this.fb.control<Date|null>(null),
    cardCode: this.fb.control<string|null>(''),
    plate: this.fb.control<string|null>(''),
    socialReason: this.fb.control<string|null>(''),
    idInstallation: this.fb.control<number|null>(null)
  });

  installations$ =this.installationsSrv.installations$;

  private destroyed$ = new Subject<void>()

  constructor(private fb: FormBuilder,
              public dialog: MatDialog,
              private eventsSrv: EventsService,
              private router: Router,
              private installationsSrv: InstallationsService) {}

  ngOnInit(): void {
    this.eventsSrv.filters$.subscribe(value => {
      this.filtersForm.patchValue(value || {dtMin: null, dtMax: null, cardCode: '', plate: '', socialReason: '', idInstallation: null}, {emitEvent: false});
      if(this.filtersForm.value.idInstallation){
        let idInstallation = toNumber(this.filtersForm.value.idInstallation);
        this.filtersForm.get('idInstallation')?.setValue(idInstallation);
      }
      if(this.filtersForm.value.dtMin){
        let dtMin = new Date(this.filtersForm.value.dtMin);
        this.filtersForm.get('dtMin')?.setValue(dtMin);
      }
      if(this.filtersForm.value.dtMax){
        let dtMax = new Date(this.filtersForm.value.dtMax);
        this.filtersForm.get('dtMax')?.setValue(dtMax);
      }
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
      const v = value as EventFilter;
      this.router.navigate([], {queryParams: v});
    });
  }
  
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  deleteFilters(){
    this.filtersForm.patchValue({dtMin: null, dtMax: null, cardCode: '', plate: '', socialReason: '', idInstallation: null})
  }
}
