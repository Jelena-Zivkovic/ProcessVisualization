import { Component, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { BaseImports } from 'src/libs/base-imports';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { SignInDto } from 'src/dtos/sign-in/sign-in.dto';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, CardModule, InputTextModule, ButtonModule, DividerModule, PasswordModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent extends BaseImports {
  form = new FormGroup({
    Email: new FormControl(''),
    Password: new FormControl(''),
  });

  constructor(injector: Injector) {
    super(injector);
  }


  continueAsGest() {
    this.routerService.navigate('editor');
  }

  signIn() {
    let signInDto: SignInDto = {
      Email: this.form.value.Email ?? "",
      Password: this.form.value.Password ?? ""
    }
    console.log(signInDto, this.form.value)
    this.authenticationService.login(signInDto).subscribe(res => {
      this.routerService.navigate("rooms");
    });
  }
}
