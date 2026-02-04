import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestRequestComponent } from './test-request.component';

describe('TestRequestComponent', () => {
  let component: TestRequestComponent;
  let fixture: ComponentFixture<TestRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestRequestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
