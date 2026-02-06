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
import { VoiceRecognitionService } from '../../features/voice-navigation/services/voice-recognition.service';
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
  ) { }

  ngOnInit() {
    this.sub = this.voiceService.result$.subscribe((result) => {
      if (!result || !result.text) return;

      const text = result.text;
      const isFinal = result.isFinal;

      this.zone.run(() => {
        const lowerText = text.toLowerCase();

        // 1. Fuzzy Match "Focus [Field]" - ONLY ON FINAL to avoid jumping
        if (isFinal && this.isFocusCommand(lowerText)) {
          this.el.nativeElement.focus();
          return;
        }

        // 2. Logic for when THIS field is focused
        if (document.activeElement === this.el.nativeElement) {
          // Clear command (Final only)
          if (
            isFinal &&
            (lowerText === 'clear' || lowerText === 'clear field')
          ) {
            this.updateValue('');
            return;
          }

          // Safety check for commands
          if (
            lowerText.startsWith('focus ') ||
            lowerText.startsWith('go to ') ||
            lowerText.startsWith('navigate ') ||
            lowerText.startsWith('select ') ||
            lowerText.startsWith('type ')
          ) {
            return;
          }

          // Block interim results that LOOK like the start of a command
          // This prevents "Focus" from appearing while you are saying "Focus Password"
          if (!isFinal) {
            const blockedPrefixes = [
              'f',
              'fo',
              'foc',
              'focu',
              'focus',
              's',
              'se',
              'sel',
              'sele',
              'selec',
              'select',
              'g',
              'go',
              'go ',
              'go t',
              'go to',
              'n',
              'na',
              'nav',
              'navi',
              'navig',
              'naviga',
              'navigat',
              'navigate',
              'c',
              'cl',
              'cle',
              'clea',
              'clear',
              't',
              'ty',
              'typ',
              'type',
            ];
            if (blockedPrefixes.includes(lowerText)) {
              return;
            }
          }

          // Live Typing! (Interim or Final)
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
