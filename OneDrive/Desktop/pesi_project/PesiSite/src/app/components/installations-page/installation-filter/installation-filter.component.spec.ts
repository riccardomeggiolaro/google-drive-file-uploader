import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallationFilterComponent } from './installation-filter.component';

describe('InstallationFilterComponent', () => {
  let component: InstallationFilterComponent;
  let fixture: ComponentFixture<InstallationFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstallationFilterComponent]
    });
    fixture = TestBed.createComponent(InstallationFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
