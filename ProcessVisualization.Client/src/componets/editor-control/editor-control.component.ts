import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseImports } from 'src/libs/base-imports';
import { SignalREditorService } from 'src/services/siganlrhub-editor.service';
import { AuthenticationResponseDto } from 'src/dtos/authentication-response/authentication-response.dto';
import { ControleEditorState } from 'src/enum/controle-editor-state.enum';
import { ButtonModule } from 'primeng/button';
import { SharedDo } from 'src/dos/shared/shared.do';

@Component({
  selector: 'cmp-editor-control',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './editor-control.component.html',
  styleUrls: ['./editor-control.component.scss']
})
export class EditorControlComponent extends BaseImports implements OnInit {
  @Input() groupName!: string;
  @Output() changeContorol = new EventEmitter<boolean>();
  controlStack: any[] = [];
  controlState: ControleEditorState = ControleEditorState.NoContole;
  userData: AuthenticationResponseDto;
  constructor(injector: Injector, private signalRService: SignalREditorService) {
    super(injector);
    this.userData = this.authenticationService.getLoginData();
    const diagramId = this.commonService.getDocument()?.Id;
    const roomId = this.commonService.getRoomId();

    this.sharedService.on("ChangeContoleEditorState123", this.updateControlStack.bind(this))
  }

  ngOnInit(): void {
  }

  updateControlStack(data: SharedDo) {
    this.controlStack = data.Data;
    console.log(this.controlStack);

    this.controlState = this.controlStack.find(x => x.userEmail == this.userData.Email)?.state;
    console.log(this.controlState, this.userData.Email);
    this.changeContorol.emit(this.controlState == ControleEditorState.HaveControle);
  }

  contoleRequest() {
    this.signalRService.ChangeContoleEditorState(this.groupName, this.userData.Email, ControleEditorState.HaveControle);
  }

  cancelRequest() {
    this.signalRService.ChangeContoleEditorState(this.groupName, this.userData.Email, ControleEditorState.NoContole);
  }


}
