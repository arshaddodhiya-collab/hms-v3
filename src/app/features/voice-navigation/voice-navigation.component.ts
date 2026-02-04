import { Component, OnInit } from '@angular/core';
import {
  VoiceCommandService,
  VoiceCommand,
} from '../../core/services/voice-command.service';

@Component({
  selector: 'app-voice-navigation',
  templateUrl: './voice-navigation.component.html',
  styleUrl: './voice-navigation.component.scss',
})
export class VoiceNavigationComponent implements OnInit {
  commands: VoiceCommand[] = [];

  constructor(private voiceCommandService: VoiceCommandService) {}

  ngOnInit(): void {
    this.commands = this.voiceCommandService.getCommands();
  }
}
