import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

declare var webkitSpeechRecognition: any;
declare var SpeechRecognition: any;

@Injectable({
  providedIn: 'root',
})
export class VoiceRecognitionService {
  private recognition: any;
  private isListeningSubject = new BehaviorSubject<boolean>(false);
  private textSubject = new BehaviorSubject<string>('');
  private errorSubject = new BehaviorSubject<string>('');

  isListening$ = this.isListeningSubject.asObservable();
  text$ = this.textSubject.asObservable();
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
    this.recognition.interimResults = false;
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
        // Auto-restart if we didn't explicitly stop it (optional, based on UX)
        // For now, let's keep it manual toggle or auto-stop on silence
      });
    };

    this.recognition.onresult = (event: any) => {
      this.zone.run(() => {
        const transcript =
          event.results[event.results.length - 1][0].transcript.trim();
        console.log('Recognized text:', transcript);
        this.textSubject.next(transcript);
      });
    };

    this.recognition.onerror = (event: any) => {
      this.zone.run(() => {
        console.error('Voice recognition error:', event.error);
        if (event.error === 'not-allowed') {
          this.errorSubject.next('Microphone permission denied.');
        } else if (event.error === 'no-speech') {
          // Ignore no-speech errors usually
        } else {
          this.errorSubject.next(`Error: ${event.error}`);
        }
        this.isListeningSubject.next(false);
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
