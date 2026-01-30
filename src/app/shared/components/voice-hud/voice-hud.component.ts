import { Component, OnInit } from '@angular/core';
import { VoiceRecognitionService } from '../../../core/services/voice-recognition.service';
import { VoiceCommandService } from '../../../core/services/voice-command.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-voice-hud',
  templateUrl: './voice-hud.component.html',
  styleUrls: ['./voice-hud.component.scss'],
})
export class VoiceHudComponent implements OnInit {
  isListening$: Observable<boolean>;
  text$: Observable<string>;
  error$: Observable<string>;

  constructor(
    private voiceService: VoiceRecognitionService,
    private commandService: VoiceCommandService, // Inject to ensure it's initialized
  ) {
    this.isListening$ = this.voiceService.isListening$;
    this.text$ = this.voiceService.text$;
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
