import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TriageQueueComponent } from './triage-queue.component';

describe('TriageQueueComponent', () => {
  let component: TriageQueueComponent;
  let fixture: ComponentFixture<TriageQueueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TriageQueueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TriageQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
