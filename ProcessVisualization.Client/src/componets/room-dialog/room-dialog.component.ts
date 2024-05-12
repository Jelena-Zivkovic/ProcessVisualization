import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseImports } from 'src/libs/base-imports';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'cmp-room-dialog',
  standalone: true,
  imports: [CommonModule, ButtonModule, ReactiveFormsModule, InputTextModule, InputTextareaModule],
  templateUrl: './room-dialog.component.html',
  styleUrls: ['./room-dialog.component.scss']
})
export class RoomDialogComponent extends BaseImports implements OnInit {
  @Output() closeDialog = new EventEmitter<boolean>();
  roomForm!: FormGroup;
  constructor(injector: Injector, private messageService: MessageService) {
    super(injector);

  }
  ngOnInit(): void {
    this.roomForm = this.formBuilder.group({
      Name: new FormControl("", [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]),
      Description: new FormControl('')
    });
  }

  cancel() {
    this.closeDialog.emit(false);
  }

  submit() {
    var room = {
      Name: this.roomForm.controls['Name'].value,
      Description: this.roomForm.controls['Description'].value
    }

    this.webapiRoomsService.createRoom(room).subscribe(res => {
      console.log(res)
      if (res.IsSuccess) {
        this.closeDialog.emit(true);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "The room " + res.Data?.Name + " has been created" });
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res.Message ?? "" });
      }
      console.log(res);
    })
  }
}
