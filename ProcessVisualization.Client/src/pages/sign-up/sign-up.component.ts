import { Component, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { BaseImports } from 'src/libs/base-imports';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SignUpDto } from 'src/dtos/sign-up/sign-up.dto';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, CardModule, InputTextModule, ButtonModule, DividerModule],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent extends BaseImports {
  form = new FormGroup({
    Email: new FormControl('', [Validators.required]),
    Password: new FormControl('', [Validators.required, Validators.minLength(5)]),
  });
  constructor(injector: Injector) {
    super(injector);
  }

  createAccount() {
    var user: SignUpDto = {
      Email: this.form.controls["Email"].value ?? "",
      Password: this.form.controls["Password"].value ?? ""
    }
    console.log(user);

    this.webapiUsersService.signUp(user).subscribe(res => {
      console.log(res);
      this.routerService.navigate("/");
    })
  }
}
