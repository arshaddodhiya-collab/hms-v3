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
import Fuse from 'fuse.js';

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

        // 1. Fuzzy Match "Focus [Field]"
        if (this.isFocusCommand(lowerText)) {
          this.el.nativeElement.focus();
          return;
        }

        // 2. Logic for when THIS field is focused
        if (document.activeElement === this.el.nativeElement) {
          // Command: "Clear"
          if (lowerText === 'clear' || lowerText === 'clear field') {
            this.updateValue('');
            return;
          }

          // Avoid typing commands that start with "focus" or specific keywords
          // This creates a bit of a race condition if "Focus Password" is said while Username is focused.
          // But since we handle Focus above, hopefully the other directive catches it?
          // We need to be careful not to type "Focus Password" into the Username field.
          if (
            lowerText.startsWith('focus ') ||
            lowerText.startsWith('go to ') ||
            lowerText.startsWith('navigate ')
          ) {
            return;
          }

          // Type the text
          this.updateValue(text);
        }
      });
    });
  }

  private isFocusCommand(text: string): boolean {
    // Check if text starts with "focus" or "select"
    if (!text.startsWith('focus ') && !text.startsWith('select ')) {
      return false;
    }

    const target = text.replace(/^(focus|select)\s+/, '');

    // Fuzzy match target against this.fieldName
    // We create a tiny Fuse instance just for this check?
    // Or just Levenshtein? Fuse is overkill but consistent.

    const list = [{ name: this.fieldName }];
    const fuse = new Fuse(list, { keys: ['name'], threshold: 0.4 });
    const result = fuse.search(target);

    return result.length > 0;
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
