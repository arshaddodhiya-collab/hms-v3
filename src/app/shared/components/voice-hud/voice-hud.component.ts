import { Component, OnInit } from '@angular/core';
import {
  VoiceRecognitionService,
  VoiceResult,
} from '../../../features/voice-navigation/services/voice-recognition.service';
import { VoiceCommandService } from '../../../features/voice-navigation/services/voice-command.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-voice-hud',
  templateUrl: './voice-hud.component.html',
  styleUrls: ['./voice-hud.component.scss'],
})
export class VoiceHudComponent implements OnInit {
  isListening$: Observable<boolean>;
  result$: Observable<VoiceResult>;
  text$: Observable<string>;
  error$: Observable<string>;

  constructor(
    private voiceService: VoiceRecognitionService,
    private commandService: VoiceCommandService, // Inject to ensure it's initialized
  ) {
    this.isListening$ = this.voiceService.isListening$;
    this.result$ = this.voiceService.result$;
    this.text$ = this.result$.pipe(map((res) => res.text));
    this.error$ = this.voiceService.error$;
  }

  ngOnInit(): void {
    // Ensure command service listens
    this.commandService.init();
  }

  toggleVoice(): void {
    this.voiceService.toggle();
  }
}
