import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientChannelComponent } from './patient-channel.component';

describe('PatientChannelComponent', () => {
  let component: PatientChannelComponent;
  let fixture: ComponentFixture<PatientChannelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientChannelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
