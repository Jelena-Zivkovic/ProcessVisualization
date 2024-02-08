import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditorComponent } from './editor/editor.component';
import { RoomsComponent } from './rooms/rooms.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';

const routes: Routes = [
  { component: SignInComponent, path: "" },
  { component: SignUpComponent, path: "sign-up" },
  { component: RoomsComponent, path: "rooms" },
  { component: EditorComponent, path: "editor" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
