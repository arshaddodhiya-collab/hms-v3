import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoiceNavigationComponent } from './voice-navigation.component';

describe('VoiceNavigationComponent', () => {
  let component: VoiceNavigationComponent;
  let fixture: ComponentFixture<VoiceNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VoiceNavigationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VoiceNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
