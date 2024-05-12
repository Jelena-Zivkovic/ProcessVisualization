import { Component, EventEmitter, Injector, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseImports } from 'src/libs/base-imports';
import { SignalREditorService } from 'src/services/siganlrhub-editor.service';

@Component({
  selector: 'app-editor-control',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './editor-control.component.html',
  styleUrls: ['./editor-control.component.scss']
})
export class EditorControlComponent extends BaseImports {
  @Output() changeContorol = new EventEmitter<boolean>();
  hasContole: boolean = false;
  constructor(injector: Injector, private signalRService: SignalREditorService) {
    super(injector);
  }

  takeContole() {

  }
}
