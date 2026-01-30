import {
  Directive,
  Input,
  ElementRef,
  OnInit,
  OnDestroy,
  Optional,
  NgZone,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { VoiceRecognitionService } from '../../core/services/voice-recognition.service';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appVoiceInput]',
})
export class VoiceInputDirective implements OnInit, OnDestroy {
  @Input('appVoiceInput') fieldName: string = '';
  private sub: Subscription = new Subscription();

  constructor(
    private el: ElementRef,
    private voiceService: VoiceRecognitionService,
    private zone: NgZone,
    @Optional() private control: NgControl,
  ) {}

  ngOnInit() {
    this.sub = this.voiceService.text$.subscribe((text) => {
      if (!text) return;

      this.zone.run(() => {
        const lowerText = text.toLowerCase();

        // Command: "Focus [Field Name]"
        if (lowerText.includes('focus ' + this.fieldName.toLowerCase())) {
          this.el.nativeElement.focus();
          return;
        }

        // Logic for when THIS field is focused
        if (document.activeElement === this.el.nativeElement) {
          // Command: "Clear"
          if (lowerText === 'clear') {
            this.updateValue('');
            return;
          }

          // Command: "Submit" (Ignore, handled by component?)
          // For now, let's just type the text.

          // Avoid typing commands that start with "focus" or specific keywords if we want
          if (
            lowerText.startsWith('focus ') ||
            lowerText.startsWith('go to ')
          ) {
            return;
          }

          // Type the text
          this.updateValue(text);
        }
      });
    });
  }

  private updateValue(val: string) {
    if (this.control) {
      this.control.control?.setValue(val);
      this.control.control?.markAsDirty();
      this.control.control?.markAsTouched();
    } else {
      this.el.nativeElement.value = val;
      this.el.nativeElement.dispatchEvent(new Event('input'));
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
