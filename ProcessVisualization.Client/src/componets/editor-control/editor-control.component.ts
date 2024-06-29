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
  requestStack: any[] = [];
  controlState: ControleEditorState = ControleEditorState.NoContole;
  userData: AuthenticationResponseDto;
  showRequest: boolean = false;
  constructor(injector: Injector, private signalRService: SignalREditorService) {
    super(injector);
    this.userData = this.authenticationService.getLoginData();

    this.sharedService.on("ChangeContoleEditorState123", this.updateControlStack.bind(this));
    this.sharedService.on("SignalRConnected", this.init.bind(this));
  }

  ngOnInit(): void {
  }

  updateControlStack(data?: SharedDo) {
    if (data !== undefined) {
      this.controlStack = data.Data;
    }

    this.controlState = this.controlStack.find(x => x.userEmail == this.userData.Email)?.state;
    this.controlState = this.controlState == undefined ? ControleEditorState.NoContole : this.controlState;
    this.requestStack = this.controlStack.filter(x => x.state == ControleEditorState.ContoleRequest && x.userEmail != this.userData.Email);
    this.changeContorol.emit(this.controlState == ControleEditorState.HaveControle);
  }

  init(data: SharedDo | boolean) {
    this.controlState = ControleEditorState.NoContole;
    setTimeout(() => {
      this.contoleRequest();
    }, 500);
  }

  contoleRequest() {
    this.signalRService.ChangeContoleEditorState(this.groupName, this.userData.Email, ControleEditorState.HaveControle);
  }

  cancelRequest() {
    this.signalRService.ChangeContoleEditorState(this.groupName, this.userData.Email, ControleEditorState.NoContole);
  }

  toggleRequestPart() {
    this.showRequest = !this.showRequest;
  }
}
