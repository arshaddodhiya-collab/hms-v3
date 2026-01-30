import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

declare var webkitSpeechRecognition: any;
declare var SpeechRecognition: any;

export interface VoiceResult {
  text: string;
  isFinal: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class VoiceRecognitionService {
  private recognition: any;
  private isListeningSubject = new BehaviorSubject<boolean>(false);
  private resultSubject = new BehaviorSubject<VoiceResult>({
    text: '',
    isFinal: true,
  });
  private errorSubject = new BehaviorSubject<string>('');

  isListening$ = this.isListeningSubject.asObservable();
  result$ = this.resultSubject.asObservable();
  error$ = this.errorSubject.asObservable();

  constructor(private zone: NgZone) {
    this.initRecognition();
  }

  private initRecognition(): void {
    const { webkitSpeechRecognition }: any = window;
    const SpeechRecognition =
      (window as any).SpeechRecognition || webkitSpeechRecognition;

    if (!SpeechRecognition) {
      this.errorSubject.next(
        'Voice recognition is not supported in this browser.',
      );
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true; // Enabled!
    this.recognition.lang = 'en-US';

    this.recognition.onstart = () => {
      this.zone.run(() => {
        this.isListeningSubject.next(true);
        console.log('Voice recognition started.');
      });
    };

    this.recognition.onend = () => {
      this.zone.run(() => {
        this.isListeningSubject.next(false);
        console.log('Voice recognition ended.');
      });
    };

    this.recognition.onresult = (event: any) => {
      this.zone.run(() => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          console.log('Final:', finalTranscript);
          this.resultSubject.next({
            text: finalTranscript.trim(),
            isFinal: true,
          });
        } else if (interimTranscript) {
          // console.log('Interim:', interimTranscript); // Optional log
          this.resultSubject.next({
            text: interimTranscript.trim(),
            isFinal: false,
          });
        }
      });
    };

    this.recognition.onerror = (event: any) => {
      this.zone.run(() => {
        console.error('Voice recognition error:', event.error);
        if (event.error === 'not-allowed') {
          this.errorSubject.next('Microphone permission denied.');
        } else if (event.error === 'no-speech') {
          // Ignore
        } else {
          this.errorSubject.next(`Error: ${event.error}`);
        }

        // Don't stop listening state on minor errors if continuous?
        // Actually, 'not-allowed' should stop it.
        if (event.error !== 'no-speech') {
          this.isListeningSubject.next(false);
        }
      });
    };
  }

  start(): void {
    if (this.recognition && !this.isListeningSubject.value) {
      try {
        this.recognition.start();
      } catch (e) {
        console.error('Error starting recognition:', e);
      }
    }
  }

  stop(): void {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  toggle(): void {
    if (this.isListeningSubject.value) {
      this.stop();
    } else {
      this.start();
    }
  }
}
