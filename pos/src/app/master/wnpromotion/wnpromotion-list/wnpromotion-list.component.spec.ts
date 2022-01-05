import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WnpromotionListComponent } from './wnpromotion-list.component';

describe('WnpromotionListComponent', () => {
  let component: WnpromotionListComponent;
  let fixture: ComponentFixture<WnpromotionListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WnpromotionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WnpromotionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
