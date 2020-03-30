import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRelativeDialogComponent } from './add-relative-dialog.component';

describe('AddRelativeDialogComponent', () => {
  let component: AddRelativeDialogComponent;
  let fixture: ComponentFixture<AddRelativeDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRelativeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRelativeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
