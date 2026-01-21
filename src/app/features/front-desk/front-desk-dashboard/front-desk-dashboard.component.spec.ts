import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontDeskDashboardComponent } from './front-desk-dashboard.component';

describe('FrontDeskDashboardComponent', () => {
  let component: FrontDeskDashboardComponent;
  let fixture: ComponentFixture<FrontDeskDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FrontDeskDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FrontDeskDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
