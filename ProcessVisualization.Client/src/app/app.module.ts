import { provideHttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AuthenticationService } from 'src/services/authentication.service';
import { CommonService } from 'src/services/common.service';
import { LoggerService } from 'src/services/logger.service';
import { RouterService } from 'src/services/router.service';
import { SharedService } from 'src/services/shared.service';
import { WebapiDocumentsService } from 'src/services/webapi-documents.service';
import { WebapiRoomsService } from 'src/services/webapi-rooms.service';
import { WebapiUsersService } from 'src/services/webapi-users.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EditorService } from 'src/services/editor.service';
import { BasicMathFunctions } from 'src/functions/basic-math';
import { ConditionalFunctions } from 'src/functions/conditional';
import { FunctionsGroup } from 'src/functions/functions';
import { BasicFunctions } from 'src/functions/basic';
import { DiagramSimulationComponent } from '../pages/diagram-simulation/diagram-simulation.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    ToastModule,
  ],
  exports: [
    BrowserModule,
    BrowserAnimationsModule,
  ],
  providers: [
    RouterService,
    SharedService,
    AuthenticationService,
    CommonService,
    LoggerService,
    WebapiRoomsService,
    WebapiUsersService,
    WebapiDocumentsService,
    MessageService,
    ConfirmationService,
    EditorService,
    BasicMathFunctions,
    FunctionsGroup,
    ConditionalFunctions,
    BasicFunctions,
    provideHttpClient(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
