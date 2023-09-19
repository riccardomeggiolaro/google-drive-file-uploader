import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectFilterComponent } from './subject-filter.component';

describe('SubjectFilterComponent', () => {
  let component: SubjectFilterComponent;
  let fixture: ComponentFixture<SubjectFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubjectFilterComponent]
    });
    fixture = TestBed.createComponent(SubjectFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
