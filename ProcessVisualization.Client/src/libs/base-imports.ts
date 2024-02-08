import { HttpClient } from '@angular/common/http';
import { Injector } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { ActivatedRoute } from "@angular/router";
import { AuthenticationService } from 'src/services/authentication.service';
import { CommonService } from 'src/services/common.service';
import { LoggerService } from 'src/services/logger.service';
import { RouterService } from 'src/services/router.service';
import { SharedService } from 'src/services/shared.service';
import { WebapiRoomsService } from 'src/services/webapi-rooms.service';
import { WebapiUsersService } from 'src/services/webapi-users.service';
//services
export class BaseImports {
  formBuilder: FormBuilder;
  route: ActivatedRoute;

  routerService: RouterService;
  sharedService: SharedService;
  authenticationService: AuthenticationService;
  commonService: CommonService;
  loggerService: LoggerService;
  webapiRoomsService: WebapiRoomsService;
  webapiUsersService: WebapiUsersService;

  http: HttpClient;


  constructor(injector: Injector) {
    this.formBuilder = injector.get(FormBuilder);
    this.routerService = injector.get(RouterService);
    this.sharedService = injector.get(SharedService);
    this.authenticationService = injector.get(AuthenticationService);
    this.commonService = injector.get(CommonService);
    this.route = injector.get(ActivatedRoute);
    this.loggerService = injector.get(LoggerService);

    this.webapiRoomsService = injector.get(WebapiRoomsService);
    this.webapiUsersService = injector.get(WebapiUsersService);

    this.http = injector.get(HttpClient);
  }
}
