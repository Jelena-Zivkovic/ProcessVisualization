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
import { WebapiRoomsService } from 'src/services/webapi-rooms.service';
import { WebapiUsersService } from 'src/services/webapi-users.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
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
    provideHttpClient(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
