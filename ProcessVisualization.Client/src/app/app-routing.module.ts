import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/guards/auth.guard';
import { EditorComponent } from './editor/editor.component';
import { RoomsComponent } from '../pages/rooms/rooms.component';
import { SignInComponent } from '../pages/sign-in/sign-in.component';
import { SignUpComponent } from '../pages/sign-up/sign-up.component';
import { DiagramSimulationComponent } from 'src/pages/diagram-simulation/diagram-simulation.component';

const routes: Routes = [
  { component: SignInComponent, path: "sign-in" },
  { component: SignUpComponent, path: "sign-up" },
  { component: RoomsComponent, path: "rooms", canActivate: [AuthGuard] },
  { component: EditorComponent, path: "editor" },
  { component: DiagramSimulationComponent, path: "diagram-simulation" },
  { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
