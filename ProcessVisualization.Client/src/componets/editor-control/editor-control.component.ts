import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseImports } from 'src/libs/base-imports';
import { SignalREditorService } from 'src/services/siganlrhub-editor.service';
import { AuthenticationResponseDto } from 'src/dtos/authentication-response/authentication-response.dto';
import { ControleEditorState } from 'src/enum/controle-editor-state.enum';
import { ButtonModule } from 'primeng/button';

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
  hasContole: boolean = false;
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

  updateControlStack(data: any[]) {
    this.controlStack = data;
    console.log(this.controlStack);

    this.hasContole = (this.controlStack.find(x => x.email == this.userData.Email)?.state == ControleEditorState.HaveControle);
    this.changeContorol.emit(this.hasContole);
  }

  contoleRequest() {
    this.signalRService.ChangeContoleEditorState(this.groupName, this.userData.Email, ControleEditorState.HaveControle);
  }

  cancelRequest() {
    this.signalRService.ChangeContoleEditorState(this.groupName, this.userData.Email, ControleEditorState.NoContole);
  }


}
