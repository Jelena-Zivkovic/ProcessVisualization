import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseImports } from 'src/libs/base-imports';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'cmp-room-dialog',
  standalone: true,
  imports: [CommonModule, ButtonModule,ReactiveFormsModule ],
  templateUrl: './room-dialog.component.html',
  styleUrls: ['./room-dialog.component.scss']
})
export class RoomDialogComponent  extends BaseImports  implements OnInit {
  @Output() closeDialog = new EventEmitter();
  roomForm!: FormGroup ;
  constructor(injector: Injector){
    super(injector);

  }
  ngOnInit(): void {
    this.roomForm = this.formBuilder.group({
    Name: new FormControl("",  [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]),
    Description: new FormControl('')
});
  }

  cancel(){
    this.closeDialog.emit();
  }

  submit(){
    var room ={
      Name: this.roomForm.controls['Name'].value,
      Description: this.roomForm.controls['Description'].value
    }
    console.log(this.roomForm.controls['Name'].value);
    this.webapiRoomsService.createRoom(room).subscribe(res => {
      console.log(res);
    })
  }
}
