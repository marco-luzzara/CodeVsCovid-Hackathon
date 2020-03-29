import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentsDetailsComponent } from './parents-details.component';

describe('ParentsDetailsComponent', () => {
  let component: ParentsDetailsComponent;
  let fixture: ComponentFixture<ParentsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParentsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
