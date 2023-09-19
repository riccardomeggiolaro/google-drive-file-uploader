import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { omitBy, toNumber } from 'lodash';
import { Subject, debounceTime, filter, map, takeUntil } from 'rxjs';
import { CardFilter, CardsService } from 'src/app/services/cards.service';
import { InstallationsService } from 'src/app/services/installations.service';
import { AddCardComponent } from '../../dialogs/add-card/add-card.component';

@Component({
  selector: 'app-card-filter',
  templateUrl: './card-filter.component.html',
  styleUrls: ['./card-filter.component.css']
})
export class CardFilterComponent {
  filtersForm = this.fb.group({
    cardCode: this.fb.control<string|null>(''),
    plate: this.fb.control<string|null>(''),
    socialReason: this.fb.control<string|null>(''),
    idInstallation: this.fb.control<number|null>(null)
  });

  installations$ =this.installationsSrv.installations$;

  private destroyed$ = new Subject<void>()

  constructor(private fb: FormBuilder,
              public dialog: MatDialog,
              private cardsSrv: CardsService,
              private router: Router,
              private installationsSrv: InstallationsService) {}

  ngOnInit(): void {
    this.cardsSrv.filters$.subscribe(value => {
      this.filtersForm.patchValue(value || {cardCode: '', plate: '', socialReason: '', idInstallation: null}, {emitEvent: false});
      if(this.filtersForm.value.idInstallation){
        let idInstallation = toNumber(this.filtersForm.value.idInstallation);
        this.filtersForm.get('idInstallation')?.setValue(idInstallation);
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
      const v = value as CardFilter;
      this.router.navigate([], {queryParams: v});
    });
  }
  
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  deleteFilters(){
    this.filtersForm.patchValue({cardCode: '', plate: '', socialReason: '', idInstallation: null})
  }

  openDialog(): void {
    this.dialog.open(AddCardComponent, {
      data: {username: null}
    });
  }            
}
